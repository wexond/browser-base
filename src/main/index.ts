import { ipcMain, app, Menu, session } from 'electron';
import { resolve } from 'path';
import { platform, homedir } from 'os';
import { AppWindow } from './app-window';
import { autoUpdater } from 'electron-updater';
import { loadExtensions } from './extensions';
import { registerProtocols } from './protocols';

ipcMain.setMaxListeners(0);

app.setPath('userData', resolve(homedir(), '.wexond'));

export let appWindow: AppWindow;

registerProtocols();

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
          { role: 'reload' },
          {
            type: 'normal',
            accelerator: 'CmdOrCtrl+Shift+R',
            label: 'Reload main process',
            click() {
              app.relaunch();
              app.exit();
            },
          },
        ],
      },
    ]),
  );

  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === 'notifications' || permission === 'fullscreen') {
        callback(true);
      } else {
        callback(false);
      }
    },
  );

  app.on('activate', () => {
    if (appWindow === null) {
      appWindow = new AppWindow();
    }
  });

  appWindow = new AppWindow();

  autoUpdater.on('update-downloaded', ({ version }) => {
    appWindow.webContents.send('update-available', version);
  });

  ipcMain.on('update-install', () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on('update-check', () => {
    if (process.env.ENV !== 'dev') {
      autoUpdater.checkForUpdates();
    }
  });

  ipcMain.on('window-focus', () => {
    appWindow.webContents.focus();
  });

  loadExtensions();
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});
