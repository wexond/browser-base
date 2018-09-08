import { ipcRenderer } from 'electron';

import { runExtensionsService } from './extensions';
import { runAutoUpdaterService } from './auto-updater';
import { FULLSCREEN } from '@/constants/ipc-messages';
import store from '@app/store';

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
      const tab = store.tabsStore.getTabByWebContentsId(webContentsId);
      ipcRenderer.send('get-tab-by-web-contents-id', tab ? tab : {});
    },
  );

  runAutoUpdaterService();
  runExtensionsService();
};
