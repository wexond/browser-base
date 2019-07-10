import { ipcMain, app, Menu, session } from 'electron';
import { resolve, extname } from 'path';
import { platform, homedir } from 'os';
// import { ExtensibleSession } from 'electron-extensions';

import { AppWindow } from './windows/app';
import { runAdblockService } from './services';
import { promises } from 'fs';
import { getPath } from '~/utils/paths';
import { ISettings } from '~/interfaces';
import { makeId } from '~/utils/string';
import { getMainMenu } from './menus/main';
import { runAutoUpdaterService } from './services/auto-updater';
import { checkFiles } from '~/utils/files';
import { DEFAULT_SETTINGS } from '~/constants';

export const log = require('electron-log');

const iohook = require('iohook');

iohook.start();

app.setPath('userData', resolve(homedir(), '.wexond'));
log.transports.file.level = 'verbose';
log.transports.file.file = resolve(app.getPath('userData'), 'log.log');

ipcMain.setMaxListeners(0);

app.commandLine.appendSwitch('--enable-transparent-visuals');

export let appWindow: AppWindow;
export let settings: ISettings = DEFAULT_SETTINGS;

ipcMain.on('settings', (e: any, s: ISettings) => {
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
  checkFiles();

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

  /* const extensions = new ExtensibleSession(viewSession);
   extensions.addWindow(appWindow);
 
   const extensionsPath = getPath('extensions');
   const dirs = await promises.readdir(extensionsPath);
 
   for (const dir of dirs) {
     const extension = await extensions.loadExtension(
       resolve(extensionsPath, dir),
     );
     extension.backgroundPage.webContents.openDevTools();
   }
 
   runAdblockService(viewSession);*/

  runAutoUpdaterService(appWindow);
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});
