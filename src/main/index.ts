import { ipcMain, app, Menu } from 'electron';
import { resolve } from 'path';
import { platform, homedir } from 'os';
import { AppWindow } from './app-window';
import { BrowserViewManager } from './browser-view-manager';

ipcMain.setMaxListeners(0);

app.setPath('userData', resolve(homedir(), '.wexond'));

export const appWindow = new AppWindow();
export const browserViewManager = new BrowserViewManager();

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
