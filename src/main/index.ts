import { ipcMain, app } from 'electron';
import { resolve } from 'path';
import { homedir } from 'os';
import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';
import { WindowsManager } from './windows-manager';

(process.env as any)['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
app.commandLine.appendSwitch('--enable-transparent-visuals');
ipcMain.setMaxListeners(0);

export const log = require('electron-log');

app.setPath('userData', resolve(homedir(), '.wexond'));
log.transports.file.level = 'verbose';
log.transports.file.file = resolve(app.getPath('userData'), 'log.log');

export const windowsManager = new WindowsManager();

export let settings: ISettings = DEFAULT_SETTINGS;

ipcMain.on('settings', (e: any, s: ISettings) => {
  settings = { ...settings, ...s };
});

// app.setAsDefaultProtocolClient('http');
// app.setAsDefaultProtocolClient('https');

process.on('uncaughtException', error => {
  log.error(error);
});

/*
app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});
*/
