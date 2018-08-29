import React from 'react';
import { remote, ipcRenderer } from 'electron';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { injectGlobal } from 'styled-components';
import fs from 'fs';

import { Style } from './styles';
import { runServices } from './services';
import App from './components/App';
import store from '@app/store';
import { resolve } from 'path';
import { promisify } from 'util';
import { BrowserAction } from '@app/models/browser-action';

const readFile = promisify(fs.readFile);

injectGlobal`${Style}`;

const render = (AppComponent: any) => {
  ReactDOM.render(
    <AppContainer>
      <AppComponent />
    </AppContainer>,
    document.getElementById('app'),
  );
};
(async function setup() {
  runServices();

  render(App);

  store.tabsStore.addGroup();

  const extensions = remote.getGlobal('extensions');

  for (const key in extensions) {
    const manifest = extensions[key];
    if (manifest.browser_action) {
      const {
        default_icon,
        default_title,
        default_popup,
      } = manifest.browser_action;
      const path = resolve(manifest.srcDirectory, default_icon['32']);

      const icon = window.URL.createObjectURL(new Blob([await readFile(path)]));
      const browserAction = new BrowserAction(
        manifest.extensionId,
        icon,
        default_title,
        default_popup,
      );

      store.extensionsStore.browserActions.push(browserAction);
    }
  }

  ipcRenderer.send('renderer-load');
})();

// react-hot-loader
if ((module as any).hot) {
  (module as any).hot.accept();
}
