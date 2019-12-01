import { autoUpdater } from 'electron-updater';
import { ipcMain } from 'electron';
import { WindowsManager } from '../windows-manager';

export const runAutoUpdaterService = (windowsManager: WindowsManager) => {
  ipcMain.on('update-install', () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on('update-check', () => {
    if (process.env.NODE_ENV !== 'development') {
      autoUpdater.checkForUpdates();
    }
  });

  autoUpdater.on('update-downloaded', ({ version }) => {
    for (const window of windowsManager.list) {
      window.webContents.send('update-available', version);
    }
  });
};
