import { remote, ipcRenderer } from 'electron';
import { resolve } from 'path';

const getWebContentsId = () => ipcRenderer.sendSync('get-webcontents-id');

const app = document.getElementById('app');
const container = document.getElementById('container');

let webview: Electron.WebviewTag;
let visible = false;

const removeWebview = () => {
  if (webview) {
    container.removeChild(webview);
    container.style.width = 0 + 'px';
    container.style.height = 0 + 'px';
  }
};

const hide = () => {
  if (!visible || !webview) return;
  ipcRenderer.send(`hide-${getWebContentsId()}`);
};

const show = () => {
  app.classList.add('visible');
  visible = true;
};

const createWebview = (url: string) => {
  webview = document.createElement('webview');

  webview.setAttribute('partition', 'persist:electron-extension-1');
  webview.setAttribute('src', url);
  webview.setAttribute(
    'preload',
    `file:///${resolve(
      remote.app.getAppPath(),
      'build',
      'extensions-popup-preload.js',
    )}`,
  );

  webview.style.width = '100%';
  webview.style.height = '100%';

  webview.addEventListener('dom-ready', () => {
    webview.getWebContents().addListener('context-menu', (e, params) => {
      const menu = remote.Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            webview.inspectElement(params.x, params.y);
          },
        },
      ]);

      menu.popup();
    });
  });

  webview.addEventListener('ipc-message', e => {
    if (e.channel === 'webview-size') {
      const [width, height] = e.args;
      container.style.width = (width < 10 ? 200 : width) + 'px';
      container.style.height = height + 'px';

      ipcRenderer.send(`bounds-${getWebContentsId()}`, width + 16, height + 16);

      show();

      webview.focus();
    } else if (e.channel === 'webview-blur') {
      if (visible && !webview.isDevToolsOpened()) {
        setTimeout(() => {
          hide();
        });
      }
    }
  });

  container.appendChild(webview);
};

ipcRenderer.on('visible', (e, flag, data) => {
  if (flag) {
    const { url } = data;
    createWebview(url);
  } else {
    visible = false;
    app.classList.remove('visible');
    removeWebview();
  }
});

ipcRenderer.on('inspect', () => {
  console.log('aha');
  if (webview) {
    webview.addEventListener('dom-ready', () => {
      webview.openDevTools();
    });
  }
});
