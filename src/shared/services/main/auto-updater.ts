import { BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';

import {
  UPDATE_AVAILABLE,
  UPDATE_RESTART_AND_INSTALL,
  UPDATE_CHECK,
} from '@/constants/ipc-messages';

export const runAutoUpdaterService = (window: BrowserWindow) => {
  autoUpdater.on('update-downloaded', ({ version }) => {
    window.webContents.send(UPDATE_AVAILABLE, version);
  });

  ipcMain.on(UPDATE_RESTART_AND_INSTALL, () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on(UPDATE_CHECK, () => {
    if (process.env.ENV !== 'dev') {
      autoUpdater.checkForUpdates();
    }
  });
};
