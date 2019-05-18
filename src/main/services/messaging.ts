import { ipcMain } from 'electron';

import { AppWindow } from '../app-window';

export const runMessagingService = (appWindow: AppWindow) => {
  ipcMain.on('window-focus', () => {
    appWindow.webContents.focus();
  });

  ipcMain.on('select-window', (e: any, id: number) => {
    appWindow.selectWindow(appWindow.windows.find(x => x.handle === id));
  });

  ipcMain.on('detach-window', (e: any, id: number) => {
    appWindow.detachWindow(appWindow.windows.find(x => x.handle === id));
  });

  ipcMain.on('hide-window', () => {
    if (appWindow.selectedWindow) {
      appWindow.selectedWindow.hide();
      appWindow.isWindowHidden = true;
    }
  });
};
