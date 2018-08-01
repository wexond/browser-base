const {
  app, BrowserWindow, ipcMain, protocol,
} = require('electron');
const path = require('path');
const { platform, homedir } = require('os');
const wpm = require('wexond-package-manager');
const { autoUpdater } = require('electron-updater');

const ipcMessages = require('../renderer/defaults/ipc-messages');

const PROTOCOL = 'wexond';
const URL_WHITELIST = ['newtab'];

app.setPath('userData', path.resolve(homedir(), '.wexond'));

let mainWindow;

global.extensions = [];

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
      preload: path.resolve(__dirname, 'preload.js'),
      plugins: true,
    },
  });

  if (process.env.NODE_ENV === 'dev') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.loadURL('http://localhost:8080/app.html');
  } else {
    mainWindow.loadURL(path.join('file://', __dirname, '../../static/pages/app.html'));
  }

  process.on('uncaughtException', error => {
    mainWindow.webContents.send('main-error', error);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send(ipcMessages.FULLSCREEN, true);
  });

  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send(ipcMessages.FULLSCREEN, false);
  });

  mainWindow.webContents.addListener('will-navigate', e => e.preventDefault());
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
      // eslint-disable-next-line
      if (error) console.error('Failed to register protocol');
    },
  );

  createWindow();
});

autoUpdater.on('update-downloaded', ({ version }) => {
  mainWindow.webContents.send(ipcMessages.UPDATE_AVAILABLE, version);
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});

ipcMain.on(ipcMessages.PLUGIN_INSTALL, (e, repo) => {
  wpm.default.install(repo);
});

ipcMain.on(ipcMessages.UPDATE_RESTART_AND_INSTALL, e => {
  autoUpdater.quitAndInstall();
});

ipcMain.on(ipcMessages.UPDATE_CHECK, e => {
  autoUpdater.checkForUpdates();
});

ipcMain.on('save-extensions', (e, extensions) => {
  global.extensions = extensions;
});
