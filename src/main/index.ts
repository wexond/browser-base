import 'source-map-support/register';

import { ipcMain, app, webContents } from 'electron';
import { platform } from 'os';
import { WindowsManager } from './windows-manager';

app.allowRendererProcessReuse = true;
app.name = app.name === 'wexond-nightly' ? 'Wexond Nightly' : 'Wexond';

(process.env as any)['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
app.commandLine.appendSwitch('--enable-transparent-visuals');
app.commandLine.appendSwitch('--enable-parallel-downloading');
app.commandLine.appendSwitch('remote-debugging-port', '9222');
ipcMain.setMaxListeners(0);

// app.setAsDefaultProtocolClient('http');
// app.setAsDefaultProtocolClient('https');

export const windowsManager = new WindowsManager();

process.on('uncaughtException', error => {
  console.error(error);
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('get-webcontents-id', e => {
  e.returnValue = e.sender.id;
});

ipcMain.handle(
  `web-contents-call`,
  async (e, { webContentsId, method, args }) => {
    const wc = webContents.fromId(webContentsId);
    const result = (wc as any)[method](...args);

    if (result) {
      if (result instanceof Promise) {
        return await result;
      }

      return result;
    }
  },
);
