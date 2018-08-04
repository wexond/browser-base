import { ipcMain, BrowserWindow, webContents } from 'electron';

import {
  API_TABS_QUERY,
  API_TABS_CREATE,
  API_TABS_INSERT_CSS,
  API_TABS_EXECUTE_SCRIPT,
  API_RUNTIME_RELOAD,
} from '../constants';
import { Global } from './interfaces';

declare const global: Global;

export const runExtensionsService = (window: BrowserWindow) => {
  ipcMain.on(API_TABS_QUERY, (e: Electron.IpcMessageEvent) => {
    window.webContents.send('api-tabs-query', e.sender.id);
  });

  ipcMain.on(API_TABS_CREATE, (e: Electron.IpcMessageEvent, data: chrome.tabs.CreateProperties) => {
    window.webContents.send('api-tabs-create', data, e.sender.id);
  });

  ipcMain.on(
    API_TABS_INSERT_CSS,
    (e: Electron.IpcMessageEvent, tabId: number, details: chrome.tabs.InjectDetails) => {
      window.webContents.send(API_TABS_INSERT_CSS, tabId, details, e.sender.id);
    },
  );

  ipcMain.on(
    API_TABS_EXECUTE_SCRIPT,
    (e: Electron.IpcMessageEvent, tabId: number, details: chrome.tabs.InjectDetails) => {
      window.webContents.send(API_TABS_EXECUTE_SCRIPT, tabId, details, e.sender.id);
    },
  );

  ipcMain.on(API_RUNTIME_RELOAD, (e: Electron.IpcMessageEvent, extensionId: string) => {
    if (global.backgroundPages[extensionId]) {
      const contents = webContents.fromId(e.sender.id);
      contents.reload();
    }
  });
};
