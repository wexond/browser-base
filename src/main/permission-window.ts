import { BrowserWindow, app } from 'electron';
import { join } from 'path';

export class PermissionWindow extends BrowserWindow {
  constructor() {
    super({
      frame: false,
      resizable: false,
      width: 300,
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
      this.webContents.openDevTools({ mode: 'detach' });
    }

    this.loadURL(join('file://', app.getAppPath(), 'build/permissions.html'));
  }

  public requestPermission(name: string, url: string) {
    this.show();

    this.webContents.send('request-permission', { name, url });
  }
}
