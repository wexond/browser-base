import { BrowserWindow, app } from 'electron';
import { join } from 'path';
import { AppWindow } from './app-window';
import { TOOLBAR_HEIGHT } from '~/renderer/app/constants/design';

export class PermissionWindow extends BrowserWindow {
  constructor(public appWindow: AppWindow) {
    super({
      frame: false,
      resizable: false,
      width: 400,
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

  public requestPermission(name: string, url: string, details: any) {
    const cBounds = this.appWindow.getContentBounds();
    this.setBounds({ x: cBounds.x, y: cBounds.y + TOOLBAR_HEIGHT } as any);

    this.show();

    this.webContents.send('request-permission', { name, url, details });
  }
}
