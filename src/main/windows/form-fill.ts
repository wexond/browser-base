import { BrowserWindow, app } from 'electron';
import { join } from 'path';
import { AppWindow } from '.';

const WIDTH = 208;
const HEIGHT = 128;

export class FormFillWindow extends BrowserWindow {
  constructor(public appWindow: AppWindow) {
    super({
      frame: false,
      resizable: false,
      width: WIDTH,
      height: HEIGHT,
      transparent: true,
      fullscreenable: false,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      skipTaskbar: true,
    });

    if (process.env.ENV === 'dev') {
      this.webContents.openDevTools({ mode: 'detach' });
      this.loadURL('http://localhost:4444/form-fill.html');
    } else {
      this.loadURL(join('file://', app.getAppPath(), 'build/form-fill.html'));
    }

    this.setParentWindow(this.appWindow);
  }

  public rearrange(pos: any) {
    this.setBounds({
      x: pos.left,
      y: pos.top,
    } as any);
  }
}
