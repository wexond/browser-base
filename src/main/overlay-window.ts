import { BrowserWindow, app, ipcMain } from 'electron';
import { platform } from 'os';
import { resolve, join } from 'path';
import { appWindow } from '.';

export class OverlayWindow {
  public window: BrowserWindow;

  constructor() {
    this.createWindow();

    ipcMain.on('show-overlay', () => {
      this.window.setBounds(appWindow.window.getContentBounds());
      this.window.focus();
    });

    ipcMain.on('hide-overlay', () => {
      this.window.setSize(0, 0);
      appWindow.window.focus();
    });
  }

  public createWindow() {
    const windowData: Electron.BrowserWindowConstructorOptions = {
      frame: false,
      width: 0,
      height: 0,
      show: true,
      parent: appWindow.window,
      transparent: true,
      skipTaskbar: true,
      thickFrame: false,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        plugins: true,
        nodeIntegration: true,
      },
      icon: resolve(app.getAppPath(), 'static/app-icons/icon.png'),
    };

    this.window = new BrowserWindow(windowData);

    if (process.env.ENV === 'dev') {
      this.window.webContents.openDevTools({ mode: 'detach' });
      this.window.loadURL('http://localhost:8080/overlay.html');
    } else {
      this.window.loadURL(
        join('file://', app.getAppPath(), 'build/overlay.html'),
      );
    }
  }
}
