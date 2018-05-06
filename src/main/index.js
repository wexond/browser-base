const {
  app, BrowserWindow, ipcMain, protocol,
} = require('electron');
const path = require('path');
const { platform } = require('os');
const wpm = require('wexond-package-manager');
const ipcMessages = require('../shared/defaults/ipc-messages');

const PROTOCOL = 'wexond';

const URL_WHITELIST = ['history', 'settings', 'newtab', 'bookmarks', 'plugins', 'extensions'];

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    frame: process.env.NODE_ENV === 'dev',
    minWidth: 300,
    minHeight: 430,
    width: 900,
    height: 700,
    show: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.resolve(__dirname, 'preloads/index.js'),
      plugins: true,
    },
  });

  if (process.env.NODE_ENV === 'dev') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.loadURL(path.join('file://', __dirname, '../../static/pages/app.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send('fullscreen', true);
  });

  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send('fullscreen', false);
  });
};

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

protocol.registerStandardSchemes([PROTOCOL]);
app.on('ready', () => {
  protocol.registerFileProtocol(
    PROTOCOL,
    (request, callback) => {
      const url = request.url.substr(PROTOCOL.length + 3);

      for (const item of URL_WHITELIST) {
        if (url.startsWith(item)) {
          callback({
            path: path.resolve(__dirname, '../../static/pages', `${url.slice(0, -1)}.html`),
          });
          break;
        }
      }

      if (url.startsWith('build')) {
        callback({ path: path.resolve(__dirname, '../../', `${url}`) });
      }
    },
    error => {
      if (error) console.error('Failed to register protocol');
    },
  );

  createWindow();
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});

ipcMain.on(ipcMessages.PLUGIN_INSTALL, (event, arg) => {
  wpm.default.install(arg);
});
