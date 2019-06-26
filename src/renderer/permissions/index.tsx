import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/App';
import { fonts } from '../constants';
import store from './store';
import { ipcRenderer } from 'electron';

const title = document.getElementById('title');
const permission = document.getElementById('permission');

const deny = document.getElementById('deny');
const allow = document.getElementById('allow');

ipcRenderer.on('request-permission', (e: any, { url, name, details }: any) => {
  const domain = getDomain(url);
  title.textContent = `${domain} wants to:`;

  if (name === 'notifications') {
    permission.textContent = 'Show notifications';
  } else if (name === 'media') {
    if (details.mediaTypes.indexOf('audio') !== -1) {
      permission.textContent = 'Access your microphone';
    } else if (details.mediaTypes.indexOf('video') !== -1) {
      permission.textContent = 'Access your camera';
    }
  } else if (name === 'geolocation') {
    permission.textContent = 'Know your location';
  }
});

const sendResult = (r: boolean) => {
  ipcRenderer.send('request-permission-result', r);
};

deny.onclick = () => {
  sendResult(false);
};

allow.onclick = () => {
  sendResult(true);
};

ipcRenderer.setMaxListeners(0);

const styleElement = document.createElement('style');

styleElement.textContent = `
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(${fonts.robotoRegular}) format('woff2');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(${fonts.robotoMedium}) format('woff2');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: url(${fonts.robotoLight}) format('woff2');
}
`;

document.head.appendChild(styleElement);

store.tabGroups.addGroup();
ReactDOM.render(<App />, document.getElementById('app'));
