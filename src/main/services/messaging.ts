import { ipcMain } from 'electron';

import { AppWindow } from '../windows';

export const runMessagingService = (appWindow: AppWindow) => {
  ipcMain.on('window-focus', () => {
    appWindow.focus();
    appWindow.webContents.focus();
  });

  ipcMain.on('update-tab-find-info', (e: any, ...args: any[]) =>
    appWindow.webContents.send('update-tab-find-info', ...args),
  );

  ipcMain.on('find-show', (e: any, tabId: number, data: any) => {
    appWindow.findWindow.find(tabId, data);
  });

  ipcMain.on('permission-dialog-hide', e => {
    appWindow.permissionWindow.hide();
  });

  ipcMain.on('update-find-info', (e: any, tabId: number, data: any) =>
    appWindow.findWindow.updateInfo(tabId, data),
  );
};
