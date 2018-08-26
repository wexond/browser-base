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
  API_I18N_OPERATION,
} from '~/constants';
import { Global } from '../interfaces';
import { ExtensionLocale } from '~/interfaces';
import { localeBaseName } from '~/defaults';
import { replaceAll } from '~/utils';

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

  ipcMain.on(API_I18N_OPERATION, (e: Electron.IpcMessageEvent, data: any) => {
    const { extensionId } = data;
    const manifest = global.extensions[extensionId];
    const defaultLocale = manifest.default_locale;

    const locale: ExtensionLocale =
      global.extensionsLocales[extensionId][defaultLocale];

    if (data.type === 'get-message') {
      const { messageName, substitutions } = data;
      const substitutionsArray = substitutions instanceof Array;
      const item = locale[messageName];

      if (item == null) {
        return (e.returnValue = '');
      }

      if (substitutionsArray && substitutions.length >= 9) {
        return (e.returnValue = null);
      }

      let message = item.message;

      if (typeof item.placeholders === 'object') {
        for (const placeholder in item.placeholders) {
          message = replaceAll(
            message,
            `$${placeholder}$`,
            item.placeholders[placeholder].content,
          );
        }
      }

      if (substitutionsArray) {
        for (let i = 0; i < 9; i++) {
          message = replaceAll(message, `$${i + 1}`, substitutions[i] || ' ');
        }
      }

      e.returnValue = message;
    } else if (data.type === 'get-accept-languages') {
      const contents = webContents.fromId(e.sender.id);
      const msg = API_I18N_OPERATION + data.id;

      // TODO
      const locales = [global.locale];
      if (global.locale !== localeBaseName) {
        locales.push(localeBaseName);
      }

      contents.send(msg, locales);
    }

    return '';
  });
};
