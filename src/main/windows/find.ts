import { BrowserWindow, app } from 'electron';
import { join } from 'path';
import { AppWindow } from '.';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants/design';

const WIDTH = 400;
const HEIGHT = 64;

export class FindWindow extends BrowserWindow {
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
      this.loadURL('http://localhost:4444/find.html');
    } else {
      this.loadURL(join('file://', app.getAppPath(), 'build/find.html'));
    }

    this.setParentWindow(this.appWindow);
  }

  public find(tabId: number, data: any) {
    data.visible = true;
    this.rearrange();
    this.show();
    this.updateInfo(tabId, data);
  }

  public updateInfo(tabId: number, data: any) {
    this.webContents.send('update-info', tabId, data);
  }

  public rearrange() {
    const cBounds = this.appWindow.getContentBounds();
    this.setBounds({
      x: Math.round(cBounds.x + cBounds.width - WIDTH),
      y: cBounds.y + TOOLBAR_HEIGHT,
    } as any);
  }
}
