import { BrowserWindow, app, ipcMain } from 'electron';
import { platform } from 'os';
import { resolve, join } from 'path';
import { appWindow } from '.';

export class OverlayWindow {
  public window: BrowserWindow;
  public visible = false;

  constructor() {
    this.createWindow();

    ipcMain.on('show-overlay', () => {
      this.window.setBounds(appWindow.window.getContentBounds());

      if (platform() === 'win32') {
        this.window.setResizable(false);
      } else {
        this.window.show();
      }

      this.window.focus();
      this.visible = true;
    });

    ipcMain.on('hide-overlay', () => {
      if (platform() === 'win32') {
        this.window.setResizable(true);
        this.window.setSize(0, 0);
      } else {
        this.window.hide();
      }

      appWindow.window.focus();
      this.visible = false;
    });
  }

  public createWindow() {
    const windowData: Electron.BrowserWindowConstructorOptions = {
      frame: false,
      width: 0,
      height: 0,
      show: platform() === 'win32',
      parent: appWindow.window,
      transparent: true,
      fullscreenable: false,
      titleBarStyle: 'default',
      skipTaskbar: true,
      resizable: false,
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
