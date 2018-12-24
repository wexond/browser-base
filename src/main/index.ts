import { ipcMain, BrowserWindow, app, Menu } from 'electron';
import { resolve } from 'path';
import { platform, homedir } from 'os';

import { createBrowserWindow } from './windows';

ipcMain.setMaxListeners(0);

app.setPath('userData', resolve(homedir(), '.wexond'));

let mainWindow: BrowserWindow;

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createBrowserWindow();
  }
});

app.on('ready', () => {
  // Create our menu entries so that we can use macOS shortcuts
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' },
          { role: 'quit' },
        ],
      },
    ]),
  );

  mainWindow = createBrowserWindow();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});
