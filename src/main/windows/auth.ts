import { BrowserWindow, app, ipcMain } from 'electron';
import { join } from 'path';
import { AppWindow } from '.';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants/design';

const WIDTH = 400;
const HEIGHT = 500;

export class AuthWindow extends BrowserWindow {
  constructor(public appWindow: AppWindow) {
    super({
      frame: false,
      resizable: false,
      width: WIDTH,
      height: HEIGHT,
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
      this.loadURL('http://localhost:4444/auth.html');
    } else {
      this.loadURL(join('file://', app.getAppPath(), 'build/auth.html'));
    }

    this.setParentWindow(this.appWindow);
  }

  public requestAuth(
    url: string,
  ): Promise<{ username: string; password: string }> {
    return new Promise(resolve => {
      this.rearrange();
      this.show();

      this.webContents.send('request-auth', url);

      ipcMain.once('request-auth-result', (e: any, result: any) => {
        this.hide();

        resolve(result);
      });
    });
  }

  public rearrange() {
    const cBounds = this.appWindow.getContentBounds();
    this.setBounds({
      x: Math.round(cBounds.x + cBounds.width / 2 - WIDTH / 2),
      y: cBounds.y + TOOLBAR_HEIGHT,
    } as any);
  }
}
