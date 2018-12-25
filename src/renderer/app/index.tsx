import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import store from './store';
import { fonts } from '../constants';

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

const render = (AppComponent: any) => {
  ReactDOM.render(<AppComponent />, document.getElementById('app'));
};

(async function () {
  render(App);

  if (store.tabsStore.groups.length === 0) {
    store.tabsStore.addGroup();
  }
})();
