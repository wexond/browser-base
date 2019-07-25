import { ipcMain, app } from 'electron';
import { resolve } from 'path';
import { homedir } from 'os';

import { WindowsManager } from './windows-manager';
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
import StorageService from './services/storage';

(process.env as any)['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
app.commandLine.appendSwitch('--enable-transparent-visuals');
ipcMain.setMaxListeners(0);

export const log = require('electron-log');

app.setPath('userData', resolve(homedir(), '.wexond'));
log.transports.file.level = 'verbose';
log.transports.file.file = resolve(app.getPath('userData'), 'log.log');

export const windowsManager = new WindowsManager();

// app.setAsDefaultProtocolClient('http');
// app.setAsDefaultProtocolClient('https');

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

  const extensions = new ExtensibleSession(viewSession);
  extensions.addWindow(appWindow);

  const extensionsPath = getPath('extensions');
  const dirs = await promises.readdir(extensionsPath);

  for (const dir of dirs) {
    const extension = await extensions.loadExtension(
      resolve(extensionsPath, dir),
    );
    extension.backgroundPage.webContents.openDevTools();
  }

  runAdblockService(viewSession);
  StorageService.run();
  runAutoUpdaterService(appWindow);
});
