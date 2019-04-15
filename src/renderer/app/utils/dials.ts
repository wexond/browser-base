import { callBrowserViewMethod } from '~/shared/utils/browser-view';
import store from '../store';

export const onSiteClick = (url: string) => () => {
  const tab = store.tabs.selectedTab;

  if (!tab || store.overlay.isNewTab) {
    store.tabs.addTab({ url, active: true });
  } else {
    tab.url = url;
    callBrowserViewMethod('webContents.loadURL', tab.id, url);
  }

  store.overlay.visible = false;
};
