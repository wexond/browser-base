import { remote } from 'electron';
import { join } from 'path';
import { runInThisContext } from 'vm';

import { Manifest } from '~/interfaces/manifest';
import { getAPI } from './api';
import { loadContent } from './load-content';
import { readFileSync } from 'fs';

if (
  window.location.href.startsWith('wexond://newtab') ||
  window.location.href.startsWith('http://localhost:8080/newtab.html')
) {
  loadContent('newtab');
} else if (
  window.location.href.startsWith('wexond://test-field') ||
  window.location.href.startsWith('http://localhost:8080/test-field.html')
) {
  loadContent('testField');
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
