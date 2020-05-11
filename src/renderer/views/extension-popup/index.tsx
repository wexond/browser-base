const getWebContentsId = () =>
  browser.ipcRenderer.sendSync('get-webcontents-id');

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

const _hide = () => {
  app.classList.remove('visible');
  removeWebview();
};

const hide = () => {
  visible = false;
  _hide();
  setTimeout(() => {
    browser.ipcRenderer.send(`hide-${getWebContentsId()}`);
  });
};

const show = () => {
  app.classList.add('visible');
  visible = true;
};

const createWebview = (url: string) => {
  webview = document.createElement('webview');

  webview.setAttribute('src', url);

  webview.style.width = '100%';
  webview.style.height = '100%';

  browser.ipcRenderer.on('webview-blur', () => {
    if (visible && !webview.isDevToolsOpened()) {
      hide();
    }
  });

  browser.ipcRenderer.on('webview-size', (e, width, height) => {
    container.style.width = width + 'px';
    container.style.height = height + 'px';

    show();

    webview.focus();
  });

  container.appendChild(webview);
};

browser.ipcRenderer.on('data', (e, url) => {
  console.log(url);
  createWebview(url);
});

browser.ipcRenderer.send(`loaded-${getWebContentsId()}`);
