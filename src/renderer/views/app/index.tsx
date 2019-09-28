require('v8-compile-cache');

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import { fonts } from '../../constants';
import { ipcRenderer } from 'electron';

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

ReactDOM.render(<App />, document.getElementById('app'));
