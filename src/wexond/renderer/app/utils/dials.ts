import store from '../store';
import { Tab } from '~/renderer/app/models';
import * as React from 'react';

export const onSiteClick = (url: string) => () => {
  const tab = store.tabs.selectedTab;

  if (!tab || store.overlay.isNewTab) {
    store.tabs.addTab({ url, active: true });
  } else {
    tab.url = url;
    tab.callViewMethod('webContents.loadURL', url);
  }

  store.overlay.visible = false;
};

export const onTabClick = (tab: Tab) => (e: React.MouseEvent<HTMLDivElement>) => {
  if (store.canToggleMenu && !tab.isWindow) {
    store.overlay.visible = true;
  }

  if (e.button === 4) {
    tab.close();
  }
};
