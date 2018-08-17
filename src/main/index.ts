import { app } from 'electron';
import { resolve } from 'path';
import { platform, homedir } from 'os';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

import { Global } from './interfaces';
import { defaultPaths, filesContent } from '../defaults/paths';
import { createWindow, registerProtocols, getPath } from './utils';
import { runAutoUpdaterService, runExtensionsService } from './services';

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
    const filePath = getPath(defaultPaths[key]);
    if (existsSync(filePath)) continue;

    if (filePath.indexOf('.') === -1) {
      mkdirSync(filePath);
    } else {
      writeFileSync(filePath, filesContent[key], 'utf8');
    }
  }

  mainWindow = createWindow();

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
