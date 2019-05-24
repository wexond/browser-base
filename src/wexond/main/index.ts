import { ipcMain, app, Menu, session, BrowserWindow } from 'electron';
import { resolve, extname } from 'path';
import { platform, homedir } from 'os';
import { AppWindow, WexondOptions } from './app-window';
import { autoUpdater } from 'electron-updater';
import { loadExtensions } from './extensions';
import { registerProtocols } from './protocols';
import { runWebRequestService, loadFilters } from './services/web-request';
import { existsSync, writeFileSync } from 'fs';
import { getPath } from '../shared/utils/paths';
import { Settings } from '../renderer/app/models/settings';
import { makeId } from '../shared/utils/string';

export let settings: Settings = {};
export let appWindow: AppWindow
export let log = require('electron-log');
export function setWexondLog(logger: any) {
  log = logger
}
ipcMain.on('settings', (e: any, s: Settings) => {
  settings = { ...settings, ...s };
});

registerProtocols();

app.on('ready', () => {
  if (!existsSync(getPath('settings.json'))) {
    writeFileSync(
      getPath('settings.json'),
      JSON.stringify({
        dialType: 'top-sites',
        isDarkTheme: false,
        isShieldToggled: false,
      } as Settings),
    );
  }

  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === 'notifications' || permission === 'fullscreen') {
        callback(true);
      } else {
        callback(false);
      }
    },
  );
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});

export function createWexondWindow(wexondOptions: WexondOptions, parentWindow?: BrowserWindow): AppWindow {
  appWindow = new AppWindow(wexondOptions, parentWindow);
  appWindow.on('close', () => {
    appWindow = null
  })
  session
    .fromPartition('persist:view')
    .on('will-download', (event, item, webContents) => {
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

  loadFilters();
  loadExtensions();
  runWebRequestService(appWindow);
  return appWindow
}
