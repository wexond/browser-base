import store from '../../../store';
import { callBrowserViewMethod } from '~/shared/utils/browser-view';

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

export const getSize = (i: number) => {
  const width = 800;
  return (width - 48 - (i - 1)) / i;
};
