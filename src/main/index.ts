import { ipcMain, app, Menu, session } from 'electron';
import { resolve, extname } from 'path';
import { platform, homedir } from 'os';
import { extensionsMain } from 'electron-extensions';

import { AppWindow } from './app-window';
import { runAdblockService } from './services';
import { existsSync, writeFileSync, promises, mkdirSync } from 'fs';
import { getPath } from '~/shared/utils/paths';
import { Settings } from '~/renderer/app/models/settings';
import { makeId } from '~/shared/utils/string';
import { getMainMenu } from './menus/main';
import { runAutoUpdaterService } from './services/auto-updater';

export const log = require('electron-log');

const iohook = require('iohook');

iohook.start();

app.setPath('userData', resolve(homedir(), '.wexond'));
log.transports.file.level = 'verbose';
log.transports.file.file = resolve(app.getPath('userData'), 'log.log');

ipcMain.setMaxListeners(0);

export let appWindow: AppWindow;
export let settings: Settings = {};

ipcMain.on('settings', (e: any, s: Settings) => {
  settings = { ...settings, ...s };
});

// app.setAsDefaultProtocolClient('http');
// app.setAsDefaultProtocolClient('https');

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (e, argv) => {
    if (appWindow) {
      if (appWindow.isMinimized()) appWindow.restore();
      appWindow.focus();

      if (process.env.ENV !== 'dev') {
        const path = argv[argv.length - 1];
        const ext = extname(path);

        if (ext === '.html') {
          appWindow.webContents.send('api-tabs-create', {
            url: `file:///${path}`,
            active: true,
          });
        }
      }
    }
  });
}

process.on('uncaughtException', error => {
  log.error(error);
});

app.on('ready', async () => {
  if (!existsSync(getPath('settings.json'))) {
    writeFileSync(
      getPath('settings.json'),
      JSON.stringify({
        dialType: 'top-sites',
        isDarkTheme: false,
        isShieldToggled: true,
      } as Settings),
    );
  }

  app.on('activate', () => {
    if (appWindow === null) {
      appWindow = new AppWindow();
    }
  });

  appWindow = new AppWindow();

  Menu.setApplicationMenu(getMainMenu(appWindow));

  const viewSession = session.fromPartition('persist:view');

  app.on('login', async (e, webContents, request, authInfo, callback) => {
    e.preventDefault();

    const credentials = await appWindow.authWindow.requestAuth(request.url);

    if (credentials) {
      callback(credentials.username, credentials.password);
    }
  });

  viewSession.setPermissionRequestHandler(
    async (webContents, permission, callback, details) => {
      if (permission === 'fullscreen') {
        callback(true);
      } else {
        try {
          const response = await appWindow.permissionWindow.requestPermission(
            permission,
            webContents.getURL(),
            details,
          );
          callback(response);
        } catch (e) {
          callback(false);
        }
      }
    },
  );

  viewSession.on('will-download', (event, item, webContents) => {
    const fileName = item.getFilename();
    const savePath = resolve(app.getPath('downloads'), fileName);
    const id = makeId(32);

    item.setSavePath(savePath);

    appWindow.webContents.send('download-started', {
      fileName,
      receivedBytes: 0,
      totalBytes: item.getTotalBytes(),
      savePath,
      id,
    });

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused');
        } else {
          appWindow.webContents.send('download-progress', {
            id,
            receivedBytes: item.getReceivedBytes(),
          });
        }
      }
    });
    item.once('done', (event, state) => {
      if (state === 'completed') {
        appWindow.webContents.send('download-completed', id);
      } else {
        console.log(`Download failed: ${state}`);
      }
    });
  });

  extensionsMain.setSession(viewSession);

  const extensionsPath = getPath('extensions');

  if (!existsSync(extensionsPath)) {
    mkdirSync(extensionsPath);
  } else {
    const dirs = await promises.readdir(extensionsPath);

    for (const dir of dirs) {
      extensionsMain.load(resolve(extensionsPath, dir));
    }
  }

  runAutoUpdaterService(appWindow);
  runAdblockService(viewSession);
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});
