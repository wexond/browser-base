import { BrowserWindow, app } from 'electron';
import { resolve, join } from 'path';
import { platform } from 'os';

import { OverlayWindow } from './overlay-window';

export class AppWindow {
  public overlayWindow: OverlayWindow;
  public window: BrowserWindow;

  constructor() {
    app.on('activate', () => {
      if (this.window === null) {
        this.createWindow();
      }
    });
  }

  public createWindow() {
    const windowData: Electron.BrowserWindowConstructorOptions = {
      frame: process.env.ENV === 'dev' || platform() === 'darwin',
      minWidth: 400,
      minHeight: 450,
      width: 900,
      height: 700,
      show: false,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        plugins: true,
      },
      icon: resolve(app.getAppPath(), 'static/app-icons/icon.png'),
    };

    this.window = new BrowserWindow(windowData);

    if (process.env.ENV === 'dev') {
      this.window.webContents.openDevTools({ mode: 'detach' });
      this.window.loadURL('http://localhost:4444/app.html');
    } else {
      this.window.webContents.openDevTools({ mode: 'detach' });
      this.window.loadURL(join('file://', app.getAppPath(), 'build/app.html'));
    }

    this.window.once('ready-to-show', () => {
      this.window.show();
    });

    this.window.on('closed', () => {
      this.window = null;
    });
  }
}
