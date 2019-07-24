import { ipcMain } from 'electron';

import { AppWindow } from '../windows';
import { IFormFillItem, IFormFillData } from '~/interfaces';

let formFillItems: IFormFillData[] = [
  {
    _id: 'a',
    type: 'address',
    fields: {
      name: 'Big Skrrt Krzak',
      address: 'Krzakowska 21',
      postCode: '18-07',
      city: 'Krzakowo',
      country: 'pl',
      phone: '123 456 789',
      email: 'bigkrzak@wexond.net',
    },
  },
  {
    _id: 'b',
    type: 'address',
    fields: {
      name: 'Janush Kowalski',
      address: 'Sandalowa 12',
      postCode: '155-17',
      city: 'Gdańsk',
      country: 'pl',
      phone: '400 500 600',
      email: 'janushkowalski@wexond.net',
    },
  },
  {
    _id: 'c',
    type: 'address',
    fields: {
      name: 'Jan Smith',
      address: 'Zimna -5',
      postCode: '1000-18',
      city: 'New York',
      country: 'us',
      phone: '100 200 300',
      email: 'jansmith@wexond.net',
    },
  },
  {
    _id: 'd',
    type: 'address',
    fields: {
      name: 'Random Person',
      address: 'Ciekawa 11',
      postCode: '0000-11',
      city: 'Warszawa',
      country: 'pl',
      phone: '101 202 303',
      email: 'randomperson@wexond.net',
    },
  },
  {
    _id: 'e',
    type: 'address',
    fields: {
      name: 'Unexpected Wind',
      address: 'Wiatrowa 9',
      postCode: '1234-56',
      city: 'Elopo',
      country: 'pl',
      phone: '555 111 777',
      email: 'unexpectedperson@wexond.net',
    },
  },
]; // hard-coded temporarily

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
  })
};
