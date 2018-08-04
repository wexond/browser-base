import {
  app, BrowserWindow, ipcMain, webContents,
} from 'electron';
import {
  readdirSync, readFileSync, statSync, readFile, writeFileSync, existsSync, mkdirSync,
} from 'fs';
import { resolve, join } from 'path';
import { format, parse } from 'url';

import { platform, homedir } from 'os';
import { autoUpdater } from 'electron-updater';

interface WindowState {
  bounds: Electron.Rectangle;
  maximized: boolean;
}

interface Manifest extends chrome.runtime.Manifest {
  extensionId: string;
  srcDirectory: string;
}

interface Global {
  extensions: {
    [key: string]: Manifest;
  };
  backgroundPages: {
    [key: string]: {
      html: Buffer;
      name: string;
      webContentsId: number;
    };
  };
}

declare const global: Global;

if (process.env.ENV === 'dev') {
  // eslint-disable-next-line
  require('electron-reload')(__dirname, {
    electron: join(__dirname, 'node_modules', '.bin', 'electron'),
  });
}

const ipcMessages = require('../renderer/defaults/ipc-messages');

app.setPath('userData', resolve(homedir(), '.wexond'));

const getPath = (...relativePaths: string[]) =>
  resolve(app.getPath('userData'), ...relativePaths).replace(/\\/g, '/');

if (!existsSync(getPath('plugins'))) {
  mkdirSync(getPath('plugins'));
}

if (!existsSync(getPath('extensions'))) {
  mkdirSync(getPath('extensions'));
}

global.extensions = {};
global.backgroundPages = {};

const windowDataPath = getPath('window-data.json');
const extensionsPath = getPath('extensions');

const startBackgroundPage = (manifest: Manifest) => {
  if (manifest.background) {
    let html = Buffer.from('');
    let name;

    if (manifest.background.page) {
      name = manifest.background.page;
      html = readFileSync(resolve(manifest.srcDirectory, manifest.background.page));
    } else if (manifest.background.scripts) {
      name = 'generated.html';
      const scripts = manifest.background.scripts
        .map(script => `<script src="${script}"></script>`)
        .join('');
      html = Buffer.from(`<html><body>${scripts}</body></html>`, 'utf8');
    }

    // The create method doesn't exist in the WebContents type.
    const contents = (webContents as any).create({
      partition: 'persist:wexond_extension',
      isBackgroundPage: true,
      commandLineSwitches: ['--background-page'],
      preload: resolve(__dirname, 'build/background-page-preload.js'),
    });

    global.backgroundPages[manifest.extensionId] = { html, name, webContentsId: contents.id };

    // contents.openDevTools({ mode: 'detach' });

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

const makeId = (length: number, possible: string = 'abcdefghijklmnopqrstuvwxyz') => {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return id;
};

const loadExtensions = () => {
  const files = readdirSync(extensionsPath);

  for (const dir of files) {
    const extensionPath = resolve(extensionsPath, dir);
    const stats = statSync(extensionPath);

    if (stats.isDirectory()) {
      const manifestPath = resolve(extensionPath, 'manifest.json');
      const manifest: Manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

      manifest.extensionId = makeId(32);
      manifest.srcDirectory = extensionPath;

      global.extensions[manifest.extensionId] = manifest;

      startBackgroundPage(manifest);
    }
  }
};

(app as any).on('session-created', (sess: Electron.session) => {
  sess.protocol.registerBufferProtocol(
    'wexond-extension',
    (request, callback) => {
      const parsed = parse(request.url);

      if (!parsed.hostname || !parsed.path) {
        return callback();
      }

      const manifest = global.extensions[parsed.hostname];

      if (!manifest) {
        return callback();
      }

      const page = global.backgroundPages[parsed.hostname];

      if (page && parsed.path === `/${page.name}`) {
        return callback({
          mimeType: 'text/html',
          data: page.html,
        });
      }

      readFile(join(manifest.srcDirectory, parsed.path), (err, content) => {
        if (err) {
          return (callback as any)(-6); // FILE_NOT_FOUND
        }
        return callback(content);
      });

      return null;
    },
    error => {
      if (error) {
        console.error(`Failed to register wexond-extension protocol: ${error}`);
      }
    },
  );
});

let mainWindow: Electron.BrowserWindow;

const createWindow = () => {
  // Read the last window state from file.
  const windowState: WindowState = JSON.parse(readFileSync(windowDataPath, 'utf8'));

  let windowData: Electron.BrowserWindowConstructorOptions = {
    frame: process.env.ENV === 'dev',
    minWidth: 400,
    minHeight: 450,
    width: 900,
    height: 700,
    show: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      plugins: true,
    },
  };

  // Merge bounds from the last window state to the current window options.
  if (windowState) {
    windowData = {
      ...windowData,
      ...windowState.bounds,
    };
  }

  mainWindow = new BrowserWindow(windowData);

  // Maximize if the last window was maximized.
  if (windowState && windowState.maximized) {
    mainWindow.maximize();
  }

  // Update window bounds on resize and on move when window is not maximized.
  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      windowState.bounds = mainWindow.getBounds();
    }
  });
  mainWindow.on('move', () => {
    if (!mainWindow.isMaximized()) {
      windowState.bounds = mainWindow.getBounds();
    }
  });

  // Save current window state to file.
  mainWindow.on('close', () => {
    windowState.maximized = mainWindow.isMaximized();
    writeFileSync(windowDataPath, JSON.stringify(windowState));
  });

  if (process.env.ENV === 'dev') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.loadURL('http://localhost:8080/app.html');
  } else {
    mainWindow.loadURL(join('file://', __dirname, 'static/pages/app.html'));
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

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});

autoUpdater.on('update-downloaded', ({ version }) => {
  mainWindow.webContents.send(ipcMessages.UPDATE_AVAILABLE, version);
});

ipcMain.on(ipcMessages.UPDATE_RESTART_AND_INSTALL, () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on(ipcMessages.UPDATE_CHECK, () => {
  if (process.env.ENV !== 'dev') {
    autoUpdater.checkForUpdates();
  }
});

ipcMain.on('api-tabs-query', (e: Electron.IpcMessageEvent) => {
  mainWindow.webContents.send('api-tabs-query', e.sender.id);
});

ipcMain.on('api-tabs-create', (e: Electron.IpcMessageEvent, data: chrome.tabs.CreateProperties) => {
  mainWindow.webContents.send('api-tabs-create', data, e.sender.id);
});

ipcMain.on(
  'api-tabs-insertCSS',
  (e: Electron.IpcMessageEvent, tabId: number, details: chrome.tabs.InjectDetails) => {
    mainWindow.webContents.send('api-tabs-insertCSS', tabId, details, e.sender.id);
  },
);

ipcMain.on(
  'api-tabs-executeScript',
  (e: Electron.IpcMessageEvent, tabId: number, details: chrome.tabs.InjectDetails) => {
    mainWindow.webContents.send('api-tabs-executeScript', tabId, details, e.sender.id);
  },
);

ipcMain.on('api-runtime-reload', (e: Electron.IpcMessageEvent, extensionId: string) => {
  if (global.backgroundPages[extensionId]) {
    const contents = webContents.fromId(e.sender.id);
    contents.reload();
  }
});
