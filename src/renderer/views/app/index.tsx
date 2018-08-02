import fs, {
  readdir, stat, readFileSync, readdirSync, statSync,
} from 'fs';
import url from 'url';
import { resolve } from 'path';
import { ipcRenderer, remote, webContents } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import typography from '../../mixins/typography';
import store from '../../store';
import { getPath } from '../../utils/paths';
import { loadPlugins } from '../../utils/plugins';
import App from './App';
import ipcMessages from '../../defaults/ipc-messages';
import fonts from '../../defaults/fonts';
import { BASE_PATH } from '../../constants';

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

async function setup() {
  if (!fs.existsSync(getPath('plugins'))) {
    fs.mkdirSync(getPath('plugins'));
  }

  if (!fs.existsSync(getPath('extensions'))) {
    fs.mkdirSync(getPath('extensions'));
  }

  await loadPlugins();

  ReactDOM.render(<App />, document.getElementById('app'));
}

setup();

ipcRenderer.on('extension-get-all-tabs', (e: Electron.IpcMessageEvent, data: any) => {
  const sender = remote.webContents.fromId(data.webContentsId);

  let tabs: any[] = [];

  for (const workspace of store.workspaces) {
    tabs = tabs.concat(workspace.tabs.map(tab => tab.getIpcTab()));
  }

  sender.send('extension-get-all-tabs', tabs);
});
