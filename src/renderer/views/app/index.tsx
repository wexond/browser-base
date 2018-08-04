import { existsSync, mkdirSync } from 'fs';
import { ipcRenderer, remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import { AppContainer } from 'react-hot-loader';

import typography from '../../mixins/typography';
import store from '../../store';
import { getPath } from '../../utils/paths';
import { loadPlugins } from '../../utils/plugins';
import App from './App';
import ipcMessages from '../../defaults/ipc-messages';
import fonts from '../../defaults/fonts';
import { BASE_PATH } from '../../constants';
import { CreateTabProperties, IpcTab } from '../../models/tab';
import { emitEvent } from '../../utils/extensions';

injectGlobal`
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: url(${fonts.robotoRegular}) format('truetype');
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: url(${fonts.robotoMedium}) format('truetype');
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: url(${fonts.robotoLight}) format('truetype');
  }
  
  body {
    user-select: none;
    cursor: default;
    ${typography.body2()}
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  @keyframes nersent-ui-preloader-rotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes nersent-ui-preloader-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }

  * {
    box-sizing: border-box;
  }
`;

ipcRenderer.on(ipcMessages.FULLSCREEN, (e: Electron.IpcMessageEvent, isFullscreen: boolean) => {
  store.isFullscreen = isFullscreen;
});

ipcRenderer.on(ipcMessages.UPDATE_AVAILABLE, (e: Electron.IpcMessageEvent, version: string) => {
  store.updateInfo.version = version;
  store.updateInfo.available = true;
});

ipcRenderer.send(ipcMessages.UPDATE_CHECK);

const render = (AppComponent: any) => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('app'),
  );
};

async function setup() {
  await loadPlugins();

  render(App);
}

if ((module as any).hot) {
  (module as any).hot.accept('./App', () => {
    // eslint-disable-next-line
    render(require('./App'));
  });
}

setup();

ipcRenderer.on('api-tabs-query', (e: Electron.IpcMessageEvent, webContentsId: number) => {
  const sender = remote.webContents.fromId(webContentsId);

  let tabs: IpcTab[] = [];

  for (const workspace of store.workspaces) {
    tabs = tabs.concat(workspace.tabs.map(tab => tab.getIpcTab()));
  }

  sender.send('api-tabs-query', tabs);
});

ipcRenderer.on(
  'api-tabs-create',
  (e: Electron.IpcMessageEvent, data: CreateTabProperties, webContentsId: number) => {
    const sender = remote.webContents.fromId(webContentsId);

    const { url, active, index } = data;

    const tab = store.getCurrentWorkspace().addTab({
      url,
      active,
      index,
    });

    sender.send('api-tabs-create', tab.getIpcTab());
  },
);

ipcRenderer.on(
  'api-emit-event-webRequest-onBeforeRequest',
  (e: Electron.IpcMessageEvent, details: any) => {
    emitEvent('webRequest', 'onBeforeRequest', details);
  },
);

ipcRenderer.on(
  'api-emit-event-webRequest-onHeadersReceived',
  (e: Electron.IpcMessageEvent, details: any) => {
    emitEvent('webRequest', 'onHeadersReceived', details);
  },
);

ipcRenderer.on(
  'api-emit-event-webRequest-onBeforeSendHeaders',
  (e: Electron.IpcMessageEvent, details: any) => {
    emitEvent('webRequest', 'onBeforeSendHeaders', details);
  },
);

ipcRenderer.on(
  'api-tabs-insertCSS',
  (
    e: Electron.IpcMessageEvent,
    tabId: number,
    details: chrome.tabs.InjectDetails,
    sender: number,
  ) => {
    const webContents = remote.webContents.fromId(sender);
    const page = store.getPageById(tabId);

    page.webview.insertCSS(details.code);
    webContents.send('api-tabs-insertCSS');
  },
);

ipcRenderer.on(
  'api-tabs-executeScript',
  (
    e: Electron.IpcMessageEvent,
    tabId: number,
    details: chrome.tabs.InjectDetails,
    sender: number,
  ) => {
    const webContents = remote.webContents.fromId(sender);
    const page = store.getPageById(tabId);

    page.webview.executeJavaScript(details.code, false, (result: any) => {
      webContents.send('api-tabs-executeScript', result);
    });
  },
);
