import { BrowserWindow, app, ipcMain } from 'electron';
import { join } from 'path';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants/design';
import { AppWindow } from '.';

export class PermissionsWindow extends BrowserWindow {
  constructor(public appWindow: AppWindow) {
    super({
      frame: false,
      resizable: false,
      width: 350,
      height: 200,
      transparent: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      skipTaskbar: true,
    });

    if (process.env.ENV === 'dev') {
      // this.webContents.openDevTools({ mode: 'detach' });
      this.loadURL('http://localhost:4444/permissions.html');
    } else {
      this.loadURL(join('file://', app.getAppPath(), 'build/permissions.html'));
    }

    this.setParentWindow(this.appWindow);
  }

  public async requestPermission(
    name: string,
    url: string,
    details: any,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (
        name === 'unknown' ||
        (name === 'media' && details.mediaTypes.length === 0) ||
        name === 'midiSysex'
      ) {
        return reject('Unknown permission');
      }

      this.rearrange();
      this.show();

      this.webContents.send('request-permission', { name, url, details });

      ipcMain.once('request-permission-result', (e: any, r: boolean) => {
        resolve(r);
        this.hide();
      });
    });
  }

  public rearrange() {
    const cBounds = this.appWindow.getContentBounds();
    this.setBounds({ x: cBounds.x, y: cBounds.y + TOOLBAR_HEIGHT } as any);
  }
}
