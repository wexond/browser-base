import { autoUpdater } from 'electron-updater';
import { ipcMain } from 'electron';
import { WindowsManager } from '../windows-manager';

export const runAutoUpdaterService = (windowsManager: WindowsManager) => {
  let updateAvailable = false;

  ipcMain.on('install-update', () => {
    if (process.env.NODE_ENV !== 'development') {
      autoUpdater.quitAndInstall(true, true);
    }
  });

  ipcMain.handle('is-update-available', () => {
    return updateAvailable;
  });

  ipcMain.on('update-check', () => {
    autoUpdater.checkForUpdates();
  });

  autoUpdater.on('update-downloaded', () => {
    updateAvailable = true;

    for (const window of windowsManager.list) {
      window.webContents.send('update-available');
      window.dialogs.menuDialog.webContents.send('update-available');
    }
  });
};
