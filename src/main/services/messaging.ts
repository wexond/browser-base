import { ipcMain } from 'electron';

import { AppWindow } from '../app-window';

export const runMessagingService = (appWindow: AppWindow) => {
  ipcMain.on('window-focus', () => {
    appWindow.webContents.focus();
  });

  ipcMain.on('update-tab-find-info', (e: any, ...args: any[]) =>
    appWindow.webContents.send('update-tab-find-info', ...args),
  );

  ipcMain.on('find-show', (e: any, tabId: number, data: any) =>
    appWindow.findWindow.show(),
  );
};
