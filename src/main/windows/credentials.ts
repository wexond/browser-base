import { BrowserWindow, app, ipcMain } from 'electron';
import { join } from 'path';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants/design';
import { AppWindow } from '.';

export class CredentialsWindow extends BrowserWindow {
  constructor(public appWindow: AppWindow) {
    super({
      frame: false,
      resizable: false,
      width: 350,
      height: 175,
      transparent: true,
      show: false,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      skipTaskbar: true,
    });

    if (process.env.ENV === 'dev') {
      // this.webContents.openDevTools({ mode: 'detach' });
      this.loadURL('http://localhost:4444/credentials.html');
    } else {
      this.loadURL(join('file://', app.getAppPath(), 'build/credentials.html'));
    }

    this.setParentWindow(this.appWindow);
  }

  public rearrange() {
    const cBounds = this.appWindow.getContentBounds();
    this.setBounds({ x: cBounds.x, y: cBounds.y + TOOLBAR_HEIGHT } as any);
  }
}
