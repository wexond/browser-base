import { ipcMain, app, Menu, session } from 'electron';
import { resolve } from 'path';
import { platform, homedir } from 'os';
import { AppWindow } from './app-window';

ipcMain.setMaxListeners(0);

app.setPath('userData', resolve(homedir(), '.wexond'));

export const appWindow = new AppWindow();

session.defaultSession.setPermissionRequestHandler(
  (webContents, permission, callback) => {
    if (permission === 'notifications' || permission === 'fullscreen') {
      callback(true);
    } else {
      callback(false);
    }
  },
);

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

  appWindow.createWindow();
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});
