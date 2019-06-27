import { ipcMain, app, BrowserWindow } from 'electron';
import { resolve, extname } from 'path';
import { homedir } from 'os';
import { remove } from 'fs-extra'
import { autoUpdater } from 'electron-updater';
import { createFlowrWindow, initFlowrConfig, buildBrowserWindowConfig } from '../frontend'
import { createWexondWindow, setWexondLog } from '~/main'
import { getMigrateUserPreferences } from './migration/fromFlowrClientToFlowrPcClient'
export const log = require('electron-log');
const migrateUserPreferences = getMigrateUserPreferences()
if (migrateUserPreferences) {
  initFlowrConfig(migrateUserPreferences)
}

app.commandLine.appendSwitch('widevine-cdm-path', resolve('/Applications/Google Chrome.app/Contents/Versions/74.0.3729.169/Google Chrome Framework.framework/Versions/A/Libraries/WidevineCdm/_platform_specific/mac_x64'))
// The version of plugin can be got from `chrome://components` page in Chrome.
app.commandLine.appendSwitch('widevine-cdm-version', '4.10.1303.2')

app.setPath('userData', resolve(homedir(), '.flowr-electron'));
log.transports.file.level = 'verbose';
log.transports.file.file = resolve(app.getPath('userData'), 'log.log');
setWexondLog(log)
ipcMain.setMaxListeners(0);
let flowrWindow: BrowserWindow = null
let wexondWindow: BrowserWindow = null
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (e, argv) => {
    if (flowrWindow) {
      if (flowrWindow.isMinimized()) flowrWindow.restore();
      flowrWindow.focus();
    }
  });
}

process.on('uncaughtException', error => {
  log.error(error);
});

app.on('ready', async () => {

  app.on('activate', async () => {
    if (flowrWindow === null) {
      flowrWindow = await createFlowrWindow();
      flowrWindow.on('close', () => {
        flowrWindow = null;
      })
    }
  });
  flowrWindow = await createFlowrWindow();
  flowrWindow.on('close', () => {
    flowrWindow = null;
  })

  autoUpdater.on('update-downloaded', ({ version }) => {
    // TODO
    flowrWindow.webContents.send('update-available', version);
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
    flowrWindow.webContents.focus();
  });

  ipcMain.on('open-browser', (event: Event, options: any) => {
    if (wexondWindow === null) {
      wexondWindow = createWexondWindow(options, flowrWindow, buildBrowserWindowConfig({}))
      wexondWindow.on('close', () => {
        wexondWindow = null;
      })
    } else {
      // wexondWindow.moveTop()
      wexondWindow.webContents.send('open-tab', options)
    }
  })
  ipcMain.on('close-browser', () => {
    if (wexondWindow !== null) {
      wexondWindow.close()
    }
  })
  ipcMain.on('open-flowr', () => {
    if (wexondWindow !== null) {
      wexondWindow.close()
    }
    // flowrWindow.moveTop()
  })
});

ipcMain.on('clear-application-data', async () => {
  await remove(app.getPath('userData'))
  app.relaunch();
  app.exit();
});

app.on('window-all-closed', () => {
  app.quit();
});
