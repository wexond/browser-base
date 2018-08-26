import { app, session, ipcMain, webContents } from 'electron';
import { resolve } from 'path';
import { platform, homedir } from 'os';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

import { runAutoUpdaterService, runExtensionsService } from './services';
import { Global } from './interfaces';
import { createWindow, getPath, registerProtocols } from './utils';
import { defaultPaths, filesContent } from '~/defaults';
import { matchesPattern } from '~/utils/url';

app.setPath('userData', resolve(homedir(), '.wexond'));

declare const global: Global;

let mainWindow: Electron.BrowserWindow;

global.extensions = {};
global.backgroundPages = {};
global.locale = 'en-US';
global.databases = {};

const eventListeners: any = {};

const getRequestType = (type: string): any => {
  if (type === 'mainFrame') return 'main_frame';
  if (type === 'subFrame') return 'sub_frame';
  if (type === 'cspReport') return 'csp_report';
  return type;
};

const getDetails = (details: any) => {};

const matchesFilter = (filter: any, url: string) => {
  if (filter && Array.isArray(filter.urls)) {
    for (const item of filter.urls) {
      if (matchesPattern(item, url)) {
        return true;
      }
    }
  }
  return false;
};

const getTabIdByWebContentsId = async (webContentsId: number) => {
  return new Promise((resolve: (result: number) => void) => {
    mainWindow.webContents.send('get-tab-id', { webContentsId });

    ipcMain.once('get-tab-id', (e: any, tabId: number) => {
      resolve(tabId);
    });
  });
};

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    mainWindow = createWindow();
  }
});

app.on('ready', () => {
  for (const key in defaultPaths) {
    const path = defaultPaths[key];
    const filePath = getPath(path);
    if (existsSync(filePath)) continue;

    if (path.indexOf('.') === -1) {
      mkdirSync(filePath);
    } else {
      writeFileSync(filePath, filesContent[key], 'utf8');
    }
  }

  mainWindow = createWindow();

  session
    .fromPartition('persist:webviewsession')
    .webRequest.onBeforeSendHeaders(
      { urls: ['http://*/*', 'https://*/*'] },
      (details: any, callback: any) => {
        details.requestHeaders['DNT'] = '1';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
      },
    );

  runAutoUpdaterService(mainWindow);
  runExtensionsService(mainWindow);

  session
    .fromPartition('persist:webviewsession')
    .webRequest.onBeforeRequest((details, callback) => {
      let callbackCalled = false;

      const newDetails: chrome.webRequest.WebRequestDetails = {
        requestId: details.id.toString(),
        url: details.url,
        method: details.method,
        frameId: 0,
        parentFrameId: -1,
        tabId: 0,
        type: getRequestType(details.resourceType),
        timeStamp: Date.now(),
      };

      let isIntercepted = false;

      if (Array.isArray(eventListeners.onBeforeRequest)) {
        for (const event of eventListeners.onBeforeRequest) {
          if (matchesFilter(event.filters, details.url)) {
            const contents = webContents.fromId(event.webContentsId);
            contents.send(
              `api-webRequest-intercepted-onBeforeRequest-${event.id}`,
              newDetails,
            );

            ipcMain.once(
              `api-webRequest-response-onBeforeRequest-${event.id}`,
              (event: any, res: any) => {
                if (!callbackCalled) {
                  if (res) {
                    callback(res);
                  } else {
                    callback({ cancel: false });
                  }

                  callbackCalled = true;
                }
              },
            );

            isIntercepted = true;
          }
        }
      }

      if (!isIntercepted) {
        callback({ cancel: false });
      }
    });

  ipcMain.on('api-add-webRequest-listener', (e: any, data: any) => {
    const { id, name, filters } = data;

    const item: any = {
      id,
      filters,
      webContentsId: e.sender.id,
    };

    if (eventListeners[name]) {
      eventListeners[name].push(item);
    } else {
      eventListeners[name] = [item];
    }
  });

  ipcMain.on('api-remove-webRequest-listener', (e: any, data: any) => {
    const { id, name } = data;
    if (eventListeners[name]) {
      eventListeners[name] = eventListeners[name].filter(
        (x: any) => x.id !== id && x.webContentsId !== e.sender.id,
      );
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});

registerProtocols();
