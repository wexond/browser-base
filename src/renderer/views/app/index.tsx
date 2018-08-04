import { ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import { AppContainer } from 'react-hot-loader';

import store from '../../store';
import App from './App';
import { runExtensionsService } from '../../extensions-service';
import { loadPlugins } from '../../../utils';
import { FULLSCREEN, UPDATE_AVAILABLE, UPDATE_CHECK } from '../../../constants';
import { fonts } from '../../../defaults';
import { body2 } from '../../mixins';

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
    ${body2()}
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
`;

ipcRenderer.on(FULLSCREEN, (e: Electron.IpcMessageEvent, isFullscreen: boolean) => {
  store.isFullscreen = isFullscreen;
});

ipcRenderer.on(UPDATE_AVAILABLE, (e: Electron.IpcMessageEvent, version: string) => {
  store.updateInfo.version = version;
  store.updateInfo.available = true;
});

ipcRenderer.send(UPDATE_CHECK);

const render = (AppComponent: any) => {
  ReactDOM.render(
    <AppContainer>
      <AppComponent />
    </AppContainer>,
    document.getElementById('app'),
  );
};

(async function setup() {
  await loadPlugins();
  runExtensionsService();

  render(App);
}());

// react-hot-loader
if ((module as any).hot) {
  (module as any).hot.accept('./App', () => {
    // eslint-disable-next-line
    render(require('./App'));
  });
}
