import { BrowserWindow, app } from 'electron';
import { resolve, join } from 'path';
import { platform } from 'os';

import { BrowserViewManager } from './browser-view-manager';
import { getPath } from '~/shared/utils/paths';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const windowDataPath = getPath('window-data.json');

export class AppWindow {
  public window: BrowserWindow;
  public browserViewManager: BrowserViewManager = new BrowserViewManager();

  constructor() {
    app.on('activate', () => {
      if (this.window === null) {
        this.createWindow();
      }
    });
  }

  public createWindow() {
    let windowState: any = {};

    if (existsSync(windowDataPath)) {
      try {
        // Read the last window state from file.
        windowState = JSON.parse(readFileSync(windowDataPath, 'utf8'));
      } catch (e) {
        writeFileSync(windowDataPath, JSON.stringify({}));
      }
    }

    let windowData: Electron.BrowserWindowConstructorOptions = {
      frame: process.env.ENV === 'dev' || platform() === 'darwin',
      minWidth: 400,
      minHeight: 450,
      width: 900,
      height: 700,
      show: false,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        plugins: true,
        nodeIntegration: true,
      },
      icon: resolve(app.getAppPath(), 'static/app-icons/icon.png'),
    };

    // Merge bounds from the last window state to the current window options.
    if (windowState) {
      windowData = {
        ...windowData,
        ...windowState.bounds,
      };
    }

    this.window = new BrowserWindow(windowData);

    // Maximize if the last window was maximized.
    if (windowState && windowState.maximized) {
      this.window.maximize();
    }

    // Update window bounds on resize and on move when window is not maximized.
    this.window.on('resize', () => {
      if (!this.window.isMaximized()) {
        windowState.bounds = this.window.getBounds();
      }
    });
    this.window.on('move', () => {
      if (!this.window.isMaximized()) {
        windowState.bounds = this.window.getBounds();
      }
    });

    // Save current window state to file.
    this.window.on('close', () => {
      windowState.maximized = this.window.isMaximized();
      writeFileSync(windowDataPath, JSON.stringify(windowState));
    });

    if (process.env.ENV === 'dev') {
      this.window.webContents.openDevTools({ mode: 'detach' });
      this.window.loadURL('http://localhost:4444/app.html');
    } else {
      this.window.loadURL(join('file://', app.getAppPath(), 'build/app.html'));
    }

    this.window.once('ready-to-show', () => {
      this.window.show();
    });

    this.window.on('closed', () => {
      this.window = null;
    });

    this.window.on('enter-full-screen', () => {
      this.window.webContents.send('fullscreen', true);
    });

    this.window.on('leave-full-screen', () => {
      this.window.webContents.send('fullscreen', false);
    });

    this.window.on('scroll-touch-begin', () => {
      this.window.webContents.send('scroll-touch-begin');
    });

    this.window.on('scroll-touch-end', () => {
      this.browserViewManager.selected.webContents.send('scroll-touch-end');
      this.window.webContents.send('scroll-touch-end');
    });
  }
}
