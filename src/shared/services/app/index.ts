import { ipcRenderer } from 'electron';

import { runExtensionsService } from './extensions';
import { runAutoUpdaterService } from './auto-updater';
import { FULLSCREEN } from '@/constants/ipc-messages';
import store from '@app/store';

export * from './extensions';
export * from './auto-updater';

export const runServices = () => {
  ipcRenderer.setMaxListeners(0);

  ipcRenderer.on(
    FULLSCREEN,
    (e: Electron.IpcMessageEvent, isFullscreen: boolean) => {
      store.isFullscreen = isFullscreen;
    },
  );

  ipcRenderer.on(
    'get-tab-by-web-contents-id',
    (e: Electron.IpcMessageEvent, webContentsId: number) => {
      const tab = store.tabsStore.getTabByWebContentsId(webContentsId);
      ipcRenderer.send('get-tab-by-web-contents-id', tab ? tab : {});
    },
  );

  ipcRenderer.on('open-url', (e: Electron.IpcMessageEvent, url: any) => {
    store.tabsStore.addTab({ url, active: true });
  });

  runAutoUpdaterService();
  runExtensionsService();
};
