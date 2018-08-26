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

  ipcRenderer.on('get-tab-id', (e: any, webContentsId: number) => {
    let sent = false;
    for (const page of store.pagesStore.pages) {
      if (
        page.webview.getWebContents() &&
        page.webview.getWebContents().id === webContentsId
      ) {
        const { id } = store.tabsStore.getTabById(page.id);
        ipcRenderer.send('get-tab-id', id);
        sent = true;
        break;
      }
    }
    if (!sent) {
      ipcRenderer.send('get-tab-id', null);
    }
  });

  runAutoUpdaterService();
  runExtensionsService();
};
