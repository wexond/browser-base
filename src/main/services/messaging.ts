import { ipcMain } from 'electron';

import { AppWindow } from '../windows';
import { IFormFillItem, IFormFillData } from '~/interfaces';
import storage from './storage';

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

  ipcMain.on('permission-dialog-hide', (e: any) => {
    appWindow.permissionWindow.hide();
  });

  ipcMain.on('update-find-info', (e: any, tabId: number, data: any) =>
    appWindow.findWindow.updateInfo(tabId, data),
  );

  ipcMain.on('form-fill-show', (e: any, rect: any, name: string) => {
    //const items = storage.databases.formfill.find({}, (docs) => );

    appWindow.formFillWindow.inputRect = rect;
    appWindow.formFillWindow.rearrange();
  });

  /*
  ipcMain.on('form-fill-show', (e: any, rect: any, name: string) => {
    appWindow.webContents.send('autocomplete-request-items', name);
    appWindow.formFillWindow.inputRect = rect;
    appWindow.formFillWindow.rearrange();
  });

  ipcMain.on('form-fill-hide', (e: any, pos: any) => {
    appWindow.formFillWindow.hide();
  });

  ipcMain.on('autocomplete-request-items', (e: any, items: IFormFillItem[]) => {
    appWindow.formFillWindow.webContents.send('autocomplete-get-items', items);

    if (items.length) {
      appWindow.formFillWindow.resize(items.length, items.find(r => r.subtext) != null);
      appWindow.formFillWindow.showInactive();
    } else {
      appWindow.formFillWindow.hide();
    }
  })

  ipcMain.on('form-fill-update', (e: any, id: string, persistent = false) => {
    const data = id && formFillItems.find(r => r._id === id);
    appWindow.viewManager.selected.webContents.send('form-fill-update', data, persistent);
  })*/
};
