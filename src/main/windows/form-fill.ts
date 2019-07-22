import { BrowserWindow, app } from 'electron';
import { join } from 'path';
import { AppWindow } from '.';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants';

const WIDTH = 208;
const HEIGHT = 128;
const MARGIN = 8;

export class FormFillWindow extends BrowserWindow {
  public inputRect = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  }

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

  public rearrange() {
    const cBounds = this.appWindow.getContentBounds();

    this.setBounds({
      x: cBounds.x + this.inputRect.x - 8,
      y: cBounds.y + this.inputRect.y + this.inputRect.height + TOOLBAR_HEIGHT - MARGIN + 2,
    } as any);
  }
}
