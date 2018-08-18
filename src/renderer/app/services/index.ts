import { ipcRenderer } from 'electron';

import store from '../store';
import { FULLSCREEN } from 'constants/';
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

  runAutoUpdaterService();
  runExtensionsService();
};
