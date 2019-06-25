import { ipcMain } from 'electron';

import { AppWindow } from '../app-window';

export const runMessagingService = (appWindow: AppWindow) => {
  ipcMain.on('window-focus', () => {
    appWindow.webContents.focus();
  });
};
