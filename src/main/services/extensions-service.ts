import { BrowserWindow, ipcMain, webContents } from 'electron';

import {
  API_RUNTIME_RELOAD,
  API_TABS_CREATE,
  API_TABS_EXECUTE_SCRIPT,
  API_TABS_INSERT_CSS,
  API_TABS_QUERY,
  API_STORAGE_OPERATION,
  API_RUNTIME_CONNECT,
  API_PORT_POSTMESSAGE,
} from '~/constants';
import { Global } from '../interfaces';

declare const global: Global;

export const runExtensionsService = (window: BrowserWindow) => {
  ipcMain.on(API_TABS_QUERY, (e: Electron.IpcMessageEvent) => {
    window.webContents.send(API_TABS_QUERY, e.sender.id);
  });

  ipcMain.on(
    API_TABS_CREATE,
    (e: Electron.IpcMessageEvent, data: chrome.tabs.CreateProperties) => {
      window.webContents.send(API_TABS_CREATE, data, e.sender.id);
    },
  );

  ipcMain.on(
    API_TABS_INSERT_CSS,
    (
      e: Electron.IpcMessageEvent,
      tabId: number,
      details: chrome.tabs.InjectDetails,
    ) => {
      window.webContents.send(API_TABS_INSERT_CSS, tabId, details, e.sender.id);
    },
  );

  ipcMain.on(
    API_TABS_EXECUTE_SCRIPT,
    (
      e: Electron.IpcMessageEvent,
      tabId: number,
      details: chrome.tabs.InjectDetails,
    ) => {
      window.webContents.send(
        API_TABS_EXECUTE_SCRIPT,
        tabId,
        details,
        e.sender.id,
      );
    },
  );

  ipcMain.on(
    API_RUNTIME_RELOAD,
    (e: Electron.IpcMessageEvent, extensionId: string) => {
      if (global.backgroundPages[extensionId]) {
        const contents = webContents.fromId(e.sender.id);
        contents.reload();
      }
    },
  );

  ipcMain.on(API_RUNTIME_CONNECT, (e: Electron.IpcMessageEvent, data: any) => {
    const { extensionId, portId, sender, name } = data;
    const bgPage = global.backgroundPages[extensionId];

    if (e.sender.id !== bgPage.webContentsId) {
      const contents = webContents.fromId(bgPage.webContentsId);
      contents.send(API_RUNTIME_CONNECT, { portId, sender, name });
    }
  });

  ipcMain.on(API_PORT_POSTMESSAGE, (e: Electron.IpcMessageEvent, data: any) => {
    const { portId, msg } = data;

    Object.keys(global.backgroundPages).forEach(key => {
      const bgPage = global.backgroundPages[key];
      if (e.sender.id !== bgPage.webContentsId) {
        const contents = webContents.fromId(bgPage.webContentsId);
        contents.send(API_PORT_POSTMESSAGE + portId, msg);
      }
    });

    window.webContents.send(API_PORT_POSTMESSAGE, {
      portId,
      msg,
      senderId: e.sender.id,
    });
  });

  ipcMain.on(
    API_STORAGE_OPERATION,
    (e: Electron.IpcMessageEvent, data: any) => {
      const contents = webContents.fromId(e.sender.id);
      const storage = global.databases[data.extensionId];
      const msg = API_STORAGE_OPERATION + data.id;

      if (data.type === 'get') {
        storage[data.area].get(data.arg, d => {
          console.log(d);
          contents.send(msg, d);
        });
      } else if (data.type === 'set') {
        storage[data.area].set(data.arg, () => {
          contents.send(msg);
        });
      } else if (data.type === 'clear') {
        storage[data.area].clear(() => {
          contents.send(msg);
        });
      } else if (data.type === 'remove') {
        storage[data.area].set(data.arg, () => {
          contents.send(msg);
        });
      }
    },
  );
};
