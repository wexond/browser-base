import { app } from 'electron';
import { resolve, join } from 'path';
import { platform, homedir } from 'os';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

import { getPath, isPathFile } from '../utils/paths';
import { runAutoUpdaterService } from './auto-updater';
import { runExtensionsService } from './extensions-service';
import { Global } from './interfaces';
import { createWindow } from './window';
import { registerProtocols } from './protocols';
import { defaultPaths, filesContent } from '../defaults/paths';

app.setPath('userData', resolve(homedir(), '.wexond'));

declare const global: Global;

let mainWindow: Electron.BrowserWindow;

global.extensions = {};
global.backgroundPages = {};

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

    if (!isPathFile(filePath)) {
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
