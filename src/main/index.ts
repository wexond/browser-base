import { app } from 'electron';
import { existsSync, mkdirSync } from 'fs';
import { homedir, platform } from 'os';
import { join, resolve } from 'path';

import { getPath } from '../utils/paths';
import { runAutoUpdaterService } from './auto-updater';
import { runExtensionsService } from './extensions-service';
import { Global } from './interfaces';
import { createWindow } from './window';
import { registerProtocols } from './protocols';

app.setPath('userData', resolve(homedir(), '.wexond'));

declare const global: Global;

let mainWindow: Electron.BrowserWindow;

global.extensions = {};
global.backgroundPages = {};

if (!existsSync(getPath('plugins'))) {
  mkdirSync(getPath('plugins'));
}

if (!existsSync(getPath('extensions'))) {
  mkdirSync(getPath('extensions'));
}

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    mainWindow = createWindow();
  }
});

app.on('ready', () => {
  mainWindow = createWindow();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});

runAutoUpdaterService(mainWindow);
runExtensionsService(mainWindow);
registerProtocols();

// Electron live reload
if (process.env.ENV === 'dev') {
  // eslint-disable-next-line
  require('electron-reload')(__dirname, {
    electron: join(__dirname, 'node_modules', '.bin', 'electron'),
  });
}
