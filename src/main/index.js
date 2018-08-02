const {
  app, BrowserWindow, ipcMain, webContents,
} = require('electron');
const {
  readdirSync, readFileSync, statSync, readFile,
} = require('fs');
const { resolve, join } = require('path');
const { format, parse } = require('url');
const { platform, homedir } = require('os');
const wpm = require('wexond-package-manager');
const { autoUpdater } = require('electron-updater');

const ipcMessages = require('../renderer/defaults/ipc-messages');

app.setPath('userData', resolve(homedir(), '.wexond'));

const getPath = (...relativePaths) =>
  resolve(app.getPath('userData'), ...relativePaths).replace(/\\/g, '/');

global.extensions = [];
global.backgroundPages = [];

const extensionsPath = getPath('extensions');

const startBackgroundPage = manifest => {
  if (manifest.background) {
    let html = Buffer.from('');
    let name;

    if (manifest.background.page) {
      name = manifest.background.page;
      html = readFileSync(resolve(manifest.srcDirectory, manifest.background.page));
    } else {
      name = '_generated_background_page.html';
      if (manifest.background.scripts) {
        const scripts = manifest.background.scripts
          .map(script => `<script src="${script}"></script>`)
          .join('');
        html = Buffer.from(`<html><body>${scripts}</body></html>`, 'utf8');
      }
    }

    const contents = webContents.create({
      partition: 'persist:__wexond_extension',
      isBackgroundPage: true,
      commandLineSwitches: ['--background-page'],
      preload: resolve(__dirname, '../preloads/extension-preload.js'),
    });

    global.backgroundPages[manifest.extensionId] = { html, name, webContentsId: contents.id };

    contents.loadURL(
      format({
        protocol: 'wexond-extension',
        slashes: true,
        hostname: manifest.extensionId,
        pathname: name,
      }),
    );
  }
};

const loadExtensions = () => {
  const files = readdirSync(extensionsPath);

  for (const dir of files) {
    const extensionPath = resolve(extensionsPath, dir);
    const stats = statSync(extensionPath);

    if (stats.isDirectory()) {
      const manifestPath = resolve(extensionPath, 'manifest.json');
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

      extensions.push(manifest);

      startBackgroundPage(manifest);
    }
  }
};

app.on('session-created', sess => {
  sess.protocol.registerBufferProtocol(
    'wexond-extension',
    (request, callback) => {
      const parsed = parse(request.url);
      if (!parsed.hostname || !parsed.path) {
        return callback();
      }

      const manifest = extensions[parsed.hostname];
      if (!manifest) {
        return callback();
      }

      const page = backgroundPages[parsed.hostname];
      if (page && parsed.path === `/${page.name}`) {
        return callback({
          mimeType: 'text/html',
          data: page.html,
        });
      }

      readFile(resolve(manifest.srcDirectory, parsed.path), (err, content) => {
        if (err) {
          return callback(-6); // FILE_NOT_FOUND
        }
        return callback(content);
      });

      return null;
    },
    error => {
      if (error) {
        console.error(`Unable to register wexond-extension protocol: ${error}`);
      }
    },
  );
});

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
      preload: resolve(__dirname, 'preload.js'),
      plugins: true,
    },
  });

  if (process.env.NODE_ENV === 'dev') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.loadURL('http://localhost:8080/app.html');
  } else {
    mainWindow.loadURL(join('file://', __dirname, '../../static/pages/app.html'));
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

  loadExtensions();
};

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('ready', () => {
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

ipcMain.on('extension-get-all-tabs', e => {
  mainWindow.webContents.send('extension-get-all-tabs', e.sender.id);
});

ipcMain.on('extension-create-tab', (e, data) => {
  mainWindow.webContents.send('extension-create-tab', data, e.sender.id);
});
