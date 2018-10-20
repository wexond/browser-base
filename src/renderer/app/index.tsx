import React from 'react';
import { ipcRenderer, remote } from 'electron';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { injectGlobal } from 'styled-components';

import { Style } from '../styles';
import { runServices } from '@/services/app';
import App from './components/App';
import store from '@app/store';

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

  if (store.extensionsStore.defaultBrowserActions.length === 0) {
    await store.extensionsStore.load();
  }

  if (store.tabsStore.groups.length === 0) {
    store.tabsStore.addGroup();

    const openedFilePath = remote.process.argv[1];

    if (openedFilePath !== '.') {
      store.tabsStore.getSelectedTab().url = openedFilePath;
      store.pagesStore.getSelected().url = openedFilePath;
    }
  }

  ipcRenderer.send('renderer-load');
})();

// react-hot-loader
if ((module as any).hot) {
  (module as any).hot.accept();
}
