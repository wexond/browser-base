import { ipcMain } from 'electron';

import { AppWindow } from '../app-window';

export const runMessagingService = (appWindow: AppWindow) => {
  ipcMain.on('update-install', () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on('update-check', () => {
    if (process.env.ENV !== 'dev') {
      autoUpdater.checkForUpdates();
    }
  });

  ipcMain.on('window-focus', () => {
    appWindow.webContents.focus();
  });

  ipcMain.on('select-window', (e: any, id: number) => {
    this.selectWindow(this.windows.find(x => x.handle === id));
  });

  ipcMain.on('detach-window', (e: any, id: number) => {
    this.detachWindow(this.windows.find(x => x.handle === id));
  });

  ipcMain.on('hide-window', () => {
    if (this.selectedWindow) {
      this.selectedWindow.hide();
      this.isWindowHidden = true;
    }
  });
};
