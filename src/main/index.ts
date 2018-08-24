import { app, session } from 'electron';
import { resolve } from 'path';
import { platform, homedir } from 'os';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

import { runAutoUpdaterService, runExtensionsService } from './services';
import { Global } from './interfaces';
import { createWindow, getPath, registerProtocols } from './utils';
import { defaultPaths, filesContent } from '~/defaults';

app.setPath('userData', resolve(homedir(), '.wexond'));

declare const global: Global;

let mainWindow: Electron.BrowserWindow;

global.extensions = {};
global.backgroundPages = {};
global.locale = 'en-US';

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
