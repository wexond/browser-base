import { app } from 'electron';
import { resolve, join } from 'path';
import { platform, homedir } from 'os';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

import { Global } from './interfaces';
import { runExtensionsService } from './extensions-service';
import { runAutoUpdaterService } from './auto-updater';
import { createWindow } from './window';
import { getPath } from '../utils/other';

const defaultKeyBindings = require('../../static/defaults/key-bindings.json');

app.setPath('userData', resolve(homedir(), '.wexond'));

declare const global: Global;

let mainWindow: Electron.BrowserWindow;

global.extensions = {};
global.backgroundPages = {};

const pluginsPath = getPath('plugins');
const extensionsPath = getPath('extensions');
const keyBindingsPath = getPath('key-bindings.json');

if (!existsSync(pluginsPath)) {
  mkdirSync(pluginsPath);
}

if (!existsSync(extensionsPath)) {
  mkdirSync(extensionsPath);
}

if (!existsSync(keyBindingsPath)) {
  writeFileSync(
    keyBindingsPath,
    JSON.stringify(defaultKeyBindings, null, 2),
    'utf8',
  );
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

// Electron live reload
if (process.env.ENV === 'dev') {
  // eslint-disable-next-line
  require('electron-reload')(__dirname, {
    electron: join(__dirname, 'node_modules', '.bin', 'electron'),
  });
}
