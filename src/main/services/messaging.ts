import { ipcMain } from 'electron';

import { IFormFillItem } from '~/interfaces';
import { AppWindow } from '../windows';
import { getFormFillMenuItems } from '../utils';
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

  ipcMain.on('form-fill-show', async (e: any, rect: any, name: string, value: string) => {
    const items = await getFormFillMenuItems(name, value);

    if (items.length) {
      appWindow.formFillWindow.webContents.send('autocomplete-get-items', items);
      appWindow.formFillWindow.inputRect = rect;

      appWindow.formFillWindow.resize(items.length, items.find(r => r.subtext) != null);
      appWindow.formFillWindow.rearrange();
      appWindow.formFillWindow.showInactive();
    } else {
      appWindow.formFillWindow.hide();
    }
  });

  ipcMain.on('form-fill-hide', () => {
    appWindow.formFillWindow.hide();
  });

  ipcMain.on('form-fill-update', async (e: any, _id: string, persistent = false) => {
    const item = _id && await storage.findOne<IFormFillItem>({
      scope: 'formfill',
      query: { _id },
    });

    appWindow.viewManager.selected.webContents.send('form-fill-update', item, persistent);
  })

  ipcMain.on('credentials-show', (e: any, username: string, password: string) => {
    appWindow.credentialsWindow.webContents.send('credentials-update', username, password);
    appWindow.credentialsWindow.show();
  })

  ipcMain.on('credentials-hide', () => {
    appWindow.credentialsWindow.hide();
  })
};
