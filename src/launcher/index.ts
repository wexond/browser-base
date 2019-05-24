import { ipcMain, app, BrowserWindow } from 'electron';
import { resolve, extname } from 'path';
import { platform, homedir } from 'os';
import { remove } from 'fs-extra'
import { autoUpdater } from 'electron-updater';
import { createFlowrWindow } from '../frontend'
import { createWexondWindow, setWexondLog } from '~/main'
export const log = require('electron-log');

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

  ipcMain.on('open-browser', () => {
    if (wexondWindow === null) {
      wexondWindow = createWexondWindow()
      wexondWindow.on('close', () => {
        console.log('---> CLOSE WexondWindow')
        wexondWindow = null;
      })
    } else {
      wexondWindow.moveTop()
    }
  })
  ipcMain.on('close-browser', () => {
    if (wexondWindow !== null) {
      wexondWindow.close()
    }
  })
});

ipcMain.on('clear-application-data', async () => {
  console.log('sloud clear ====>  ', app.getPath('userData'))

  await remove(app.getPath('userData'))
  app.relaunch();
  app.exit();
});

app.on('window-all-closed', () => {
  app.quit();
});
