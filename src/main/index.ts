import { app, ipcMain, BrowserWindow } from 'electron';
import { resolve } from 'path';
import { platform, homedir } from 'os';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

import { Global } from '@/interfaces/main';
import { createWindow, loadExtensions, registerProtocols } from '@/utils/main';
import { defaultPaths, filesContent } from '@/constants/paths';
import { getPath } from '@/utils/paths';
import {
  runAutoUpdaterService,
  runExtensionsService,
  runWebRequestService,
} from '@/services/main';

ipcMain.setMaxListeners(0);

app.setPath('userData', resolve(homedir(), '.wexond'));

declare const global: Global;

let mainWindow: BrowserWindow;

global.extensions = {};
global.backgroundPages = {};
global.databases = {};
global.extensionsLocales = {};
global.extensionsAlarms = {};
global.locale = 'en-US';

global.userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

const shouldQuit = app.makeSingleInstance(argv => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.focus();

    if (argv[1] !== '.') {
      mainWindow.webContents.send('open-url', argv[1]);
    }
  }

  return true;
});

if (shouldQuit) {
  app.quit();
} else {
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

    loadExtensions(mainWindow);

    runAutoUpdaterService(mainWindow);
    runExtensionsService(mainWindow);
    runWebRequestService(mainWindow);

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
}
