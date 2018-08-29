import { ipcRenderer } from 'electron';

import store from '../store';
import { FULLSCREEN } from '~/constants';
import { runAutoUpdaterService } from './auto-updater';
import { runExtensionsService } from './extensions';

export * from './extensions';
export * from './auto-updater';

export const runServices = () => {
  ipcRenderer.on(
    FULLSCREEN,
    (e: Electron.IpcMessageEvent, isFullscreen: boolean) => {
      store.isFullscreen = isFullscreen;
    },
  );

  ipcRenderer.on(
    'get-tab-by-web-contents-id',
    (e: any, webContentsId: number) => {
      let sent = false;
      for (const page of store.pagesStore.pages) {
        if (
          page.webview.getWebContents() &&
          page.webview.getWebContents().id === webContentsId
        ) {
          const tab = store.tabsStore.getTabById(page.id).getApiTab();
          ipcRenderer.send('get-tab-by-web-contents-id', tab);
          sent = true;
          break;
        }
      }
      if (!sent) {
        ipcRenderer.send('get-tab-by-web-contents-id', {});
      }
    },
  );

  runAutoUpdaterService();
  runExtensionsService();
};
