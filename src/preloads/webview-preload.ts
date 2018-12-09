import { remote, webFrame, ipcRenderer } from 'electron';
import { join } from 'path';
import { runInThisContext } from 'vm';

import { readFileSync } from 'fs';
import { isWexondURL } from '@/utils/url';
import { getAPI } from '@/utils/extensions/get-api';
import { Manifest } from '@/interfaces/extensions';

ipcRenderer.setMaxListeners(0);

declare const global: any;

webFrame.registerURLSchemeAsPrivileged('wexond-extension');

const wexondUrl = isWexondURL(window.location.href);

if (wexondUrl) {
  global.onIpcReceived = {
    listeners: [],
    addListener: (cb: any) => {
      if (cb) {
        global.onIpcReceived.listeners.push(cb);
      }
    },
    emit: (...args: any[]) => {
      for (const cb of global.onIpcReceived.listeners) {
        if (cb) cb(...args);
      }
    },
  };

  global.wexondPages = {
    history: {
      delete: (...id: string[]) => {
        ipcRenderer.sendToHost('history-delete', ...id);
      },
    },
    bookmarks: {
      delete: (...id: string[]) => {
        ipcRenderer.sendToHost('bookmarks-delete', ...id);
      },
      edit: (id: string, title: string, parent: string) => {
        ipcRenderer.sendToHost('bookmarks-edit', id, title, parent);
      },
      addFolder: (title: string, parent: string) => {
        ipcRenderer.sendToHost('bookmarks-add-folder', title, parent);
      },
      reorder: (
        id: string,
        parent: string,
        oldIndex: number,
        newIndex: number,
      ) => {
        ipcRenderer.sendToHost(
          'bookmarks-reorder-item',
          id,
          parent,
          oldIndex,
          newIndex,
        );
      },
    },
  };

  const ipcEvents = [
    'dictionary',
    'favicons',
    'history',
    'bookmarks-add',
    'bookmarks-edit',
    'bookmarks-delete',
  ];

  for (const name of ipcEvents) {
    ipcRenderer.on(name, (e: any, data: any) => {
      global.onIpcReceived.emit(name, data);
    });
  }
}

const matchesPattern = (pattern: string, url: string) => {
  if (pattern === '<all_urls>') {
    return true;
  }

  const regexp = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
  return url.match(regexp);
};

const runContentScript = (url: string, code: string, manifest: Manifest) => {
  const context = getAPI(manifest);

  const wrapper = `((wexond) => {
    var chrome = wexond;
    var browser = wexond;
    ${code}
  });`;

  const compiledWrapper = runInThisContext(wrapper, {
    filename: url,
    lineOffset: 1,
    displayErrors: true,
  });

  return compiledWrapper.call(window, context);
};

const runStylesheet = (url: string, code: string) => {
  const wrapper = `((code) => {
    function init() {
      const styleElement = document.createElement('style');
      styleElement.textContent = code;
      document.head.append(styleElement);
    }
    document.addEventListener('DOMContentLoaded', init);
  })`;

  const compiledWrapper = runInThisContext(wrapper, {
    filename: url,
    lineOffset: 1,
    displayErrors: true,
  });

  return compiledWrapper.call(window, code);
};

const injectContentScript = (script: any, manifest: Manifest) => {
  if (
    !script.matches.some((x: string) =>
      matchesPattern(
        x,
        `${location.protocol}//${location.host}${location.pathname}`,
      ),
    )
  ) {
    return;
  }

  process.setMaxListeners(0);

  if (script.js) {
    script.js.forEach((js: any) => {
      const fire = runContentScript.bind(window, js.url, js.code, manifest);
      if (script.runAt === 'document_start') {
        (process as any).once('document-start', fire);
      } else if (script.runAt === 'document_end') {
        (process as any).once('document-end', fire);
      } else {
        document.addEventListener('DOMContentLoaded', fire);
      }
    });
  }

  if (script.css) {
    script.css.forEach((css: any) => {
      const fire = runStylesheet.bind(window, css.url, css.code);
      if (script.runAt === 'document_start') {
        (process as any).once('document-start', fire);
      } else if (script.runAt === 'document_end') {
        (process as any).once('document-end', fire);
      } else {
        document.addEventListener('DOMContentLoaded', fire);
      }
    });
  }
};

const extensions: { [key: string]: Manifest } = remote.getGlobal('extensions');

const setImmediateTemp: any = setImmediate;

process.once('loaded', () => {
  global.setImmediate = setImmediateTemp;

  Object.keys(extensions).forEach(key => {
    const manifest = extensions[key];

    if (manifest.content_scripts) {
      const readArrayOfFiles = (relativePath: string) => ({
        url: `wexond-extension://${manifest.extensionId}/${relativePath}`,
        code: readFileSync(join(manifest.srcDirectory, relativePath), 'utf8'),
      });

      try {
        manifest.content_scripts.forEach(script => {
          const newScript = {
            matches: script.matches,
            js: script.js ? script.js.map(readArrayOfFiles) : [],
            css: script.css ? script.css.map(readArrayOfFiles) : [],
            runAt: script.run_at || 'document_idle',
          };

          injectContentScript(newScript, manifest);
        });
      } catch (readError) {
        console.error('Failed to read content scripts', readError);
      }
    }
  });
});

window.onload = () => {
  // applyDarkTheme();
};
