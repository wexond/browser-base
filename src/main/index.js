const {
  app, BrowserWindow, ipcMain, webContents, session,
} = require('electron');
const {
  readdirSync, readFileSync, statSync, readFile, writeFileSync,
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

global.extensions = {};
global.backgroundPages = {};

const windowDataPath = getPath('window-data.json');
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

    contents.openDevTools({ mode: 'detach' });

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

      extensions[manifest.extensionId] = manifest;

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

      readFile(join(manifest.srcDirectory, parsed.path), (err, content) => {
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
  let data = null;
  let windowBounds = {};

  try {
    data = readFileSync(windowDataPath);
    data = JSON.parse(data);
  } catch (e) {
    console.error(e);
  }

  const windowData = {
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
  };

  if (data != null && data.bounds != null) {
    Object.assign(windowData, data.bounds);
  }

  mainWindow = new BrowserWindow(windowData);

  windowBounds = mainWindow.getBounds();

  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      windowBounds = mainWindow.getBounds();
    }
  });

  mainWindow.on('move', () => {
    if (!mainWindow.isMaximized()) {
      windowBounds = mainWindow.getBounds();
    }
  });

  if (data != null && data.maximized) {
    mainWindow.maximize();
  }

  mainWindow.on('close', () => {
    data = {
      maximized: mainWindow.isMaximized(),
      bounds: windowBounds,
    };

    writeFileSync(windowDataPath, JSON.stringify(data));
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
  if (process.env.NODE_ENV !== 'dev') {
    autoUpdater.checkForUpdates();
  }
});

ipcMain.on('extension-get-all-tabs', e => {
  mainWindow.webContents.send('extension-get-all-tabs', e.sender.id);
});

ipcMain.on('extension-create-tab', (e, data) => {
  mainWindow.webContents.send('extension-create-tab', data, e.sender.id);
});

const a = (details, callback) => {
  if (details.resourceType === 'mainFrame') {
    details.type = 'main_frame';
  } else if (details.resourceType === 'subFrame') {
    details.type = 'sub_frame';
  } else if (details.resourceType === 'cspReport') {
    details.type = 'csp_report';
  } else {
    details.type = details.resourceType;
  }

  if (details.requestHeaders) {
    const requestHeaders = [];
    Object.keys(details.requestHeaders).forEach(k => {
      requestHeaders.push({ name: k, value: details.requestHeaders[k] });
    });
    details.requestHeaders = requestHeaders;
  }

  ipcMain.once('extension-response-webRequest-onBeforeRequest', (e, request) => {
    if (request) {
      if (request.cancel) {
        callback({ cancel: true });
      } else if (request.requestHeaders) {
        const requestHeaders = {};
        request.requestHeaders.forEach(requestHeader => {
          requestHeaders[requestHeader.name] = requestHeader.value;
        });
        callback({ requestHeaders, cancel: false });
      } else if (request.redirectURL) {
        callback({ redirectURL: request.redirectURL, cancel: false });
      }
    } else {
      callback({ cancel: false });
    }
  });

  mainWindow.webContents.send('extension-emit-event-webRequest-onBeforeRequest', details);
};

const b = (details, name) => {
  details.type = details.resourceType;

  if (details.requestHeaders) {
    const requestHeaders = [];
    Object.keys(details.requestHeaders).forEach(k => {
      requestHeaders.push({ name: k, value: details.requestHeaders[k] });
    });
    details.requestHeaders = requestHeaders;
  }
  if (details.responseHeaders) {
    const responseHeaders = [];
    Object.keys(details.responseHeaders).forEach(k => {
      responseHeaders.push({ name: k, value: details.responseHeaders[k][0] });
    });
    details.responseHeaders = responseHeaders;
  }

  mainWindow.webContents.send(`extension-emit-event-webRequest-${name}`, details);
};

const c = (details, callback) => {
  details.type = details.resourceType;

  if (details.responseHeaders) {
    const responseHeaders = [];
    Object.keys(details.responseHeaders).forEach(k => {
      responseHeaders.push({ name: k, value: details.responseHeaders[k][0] });
    });
    details.responseHeaders = responseHeaders;
  }

  ipcMain.once('extension-response-webRequest-onHeadersReceived', (event, response) => {
    if (response) {
      if (response.cancel) {
        callback({ cancel: true });
      } else if (response.responseHeaders) {
        const responseHeaders = {};
        response.responseHeaders.forEach(responseHeader => {
          responseHeaders[responseHeader.name] = responseHeader.value;
        });
        if (response.statusLine) {
          callback({ responseHeaders, statusLine: response.statusLine, cancel: false });
        } else {
          callback({ responseHeaders, statusLine: details.statusLine, cancel: false });
        }
      }
    } else {
      callback({ cancel: false });
    }
  });

  mainWindow.webContents.send('extension-emit-event-webRequest-onHeadersReceived', details);
};

ipcMain.on('extension-add-listener-webRequest-onBeforeRequest', () => {
  session.defaultSession.webRequest.onBeforeRequest(a);
});

ipcMain.on('extension-add-listener-webRequest-onBeforeSendHeaders', () => {
  session.defaultSession.webRequest.onBeforeSendHeaders(a);
});

ipcMain.on('extension-add-listener-webRequest-onHeadersReceived', () => {
  session.defaultSession.webRequest.onHeadersReceived(c);
});

ipcMain.on('extension-add-listener-webRequest-onSendHeaders', () => {
  session.defaultSession.webRequest.onSendHeaders(details => b(details, 'onSendHeaders'));
});

ipcMain.on('extension-add-listener-webRequest-onResponseStarted', () => {
  session.defaultSession.webRequest.onResponseStarted(details => b(details, 'onResponseStarted'));
});

ipcMain.on('extension-add-listener-webRequest-onBeforeRedirect', () => {
  session.defaultSession.webRequest.onBeforeRedirect(details => b(details, 'onBeforeRedirect'));
});

ipcMain.on('extension-add-listener-webRequest-onCompleted', () => {
  session.defaultSession.webRequest.onCompleted(details => b(details, 'onCompleted'));
});

ipcMain.on('extension-add-listener-webRequest-onErrorOccurred', () => {
  session.defaultSession.webRequest.onErrorOccurred(details => b(details, 'onErrorOccurred'));
});

ipcMain.on('extension-remove-listener-webRequest-onBeforeRequest', e => {
  session.defaultSession.webRequest.onBeforeRequest({}, null);
});

ipcMain.on('extension-tabs-insertCSS', (e, tabId, details) => {
  mainWindow.webContents.send('extension-tabs-insertCSS', tabId, details, e.sender.id);
});

ipcMain.on('extension-tabs-executeScript', (e, tabId, details) => {
  mainWindow.webContents.send('extension-tabs-executeScript', tabId, details, e.sender.id);
});

ipcMain.on('extension-runtime-reload', (e, extensionId) => {
  if (global.backgroundPages[extensionId]) {
    const contents = webContents.fromId(e.sender.id);
    contents.reload();
  }
});
