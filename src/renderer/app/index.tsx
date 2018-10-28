import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import * as ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';

import { Style } from '../styles';
import { runServices } from '@/services/app';
import App from './components/App';
import store from '@app/store';

injectGlobal`${Style}`;

const render = (AppComponent: any) => {
  ReactDOM.render(<AppComponent />, document.getElementById('app'));
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
