import { ipcMain } from 'electron';

import { AppWindow } from '../windows';

export const runMessagingService = (appWindow: AppWindow) => {
  const { id } = appWindow.webContents;

  ipcMain.on(`window-focus-${id}`, () => {
    appWindow.focus();
    appWindow.webContents.focus();
  });

  ipcMain.on(`update-tab-find-info-${id}`, (e: any, ...args: any[]) =>
    appWindow.webContents.send('update-tab-find-info', ...args),
  );

  ipcMain.on(`find-show-${id}`, (e: any, tabId: number, data: any) => {
    appWindow.findWindow.find(tabId, data);
  });

  ipcMain.on(`permission-dialog-hide-${id}`, e => {
    appWindow.permissionWindow.hide();
  });

  ipcMain.on(`update-find-info-${id}`, (e: any, tabId: number, data: any) =>
    appWindow.findWindow.updateInfo(tabId, data),
  );
};
