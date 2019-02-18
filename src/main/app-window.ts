import { BrowserWindow, app } from 'electron';
import { resolve, join } from 'path';
import { platform } from 'os';

import { BrowserViewManager } from './browser-view-manager';
import { getPath } from '~/shared/utils/paths';
import { existsSync, readFileSync, writeFileSync } from 'fs';

export class AppWindow extends BrowserWindow {
  public browserViewManager: BrowserViewManager = new BrowserViewManager();

  constructor() {
    super({
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
    });

    const windowDataPath = getPath('window-data.json');

    let windowState: any = {};

    if (existsSync(windowDataPath)) {
      try {
        // Read the last window state from file.
        windowState = JSON.parse(readFileSync(windowDataPath, 'utf8'));
      } catch (e) {
        writeFileSync(windowDataPath, JSON.stringify({}));
      }
    }

    // Merge bounds from the last window state to the current window options.
    if (windowState) {
      this.setBounds({ ...windowState.bounds });
    }

    // Maximize if the last window was maximized.
    if (windowState && windowState.maximized) {
      this.maximize();
    }

    // Update window bounds on resize and on move when window is not maximized.
    this.on('resize', () => {
      if (!this.isMaximized()) {
        windowState.bounds = this.getBounds();
      }
    });
    this.on('move', () => {
      if (!this.isMaximized()) {
        windowState.bounds = this.getBounds();
      }
    });

    // Save current window state to file.
    this.on('close', () => {
      windowState.maximized = this.isMaximized();
      writeFileSync(windowDataPath, JSON.stringify(windowState));
    });

    if (process.env.ENV === 'dev') {
      this.webContents.openDevTools({ mode: 'detach' });
      this.loadURL('http://localhost:4444/app.html');
    } else {
      this.loadURL(join('file://', app.getAppPath(), 'build/app.html'));
    }

    this.once('ready-to-show', () => {
      this.show();
    });

    this.on('enter-full-screen', () => {
      this.webContents.send('fullscreen', true);
    });

    this.on('leave-full-screen', () => {
      this.webContents.send('fullscreen', false);
    });

    this.on('enter-html-full-screen', () => {
      this.browserViewManager.fullscreen = true;
      this.webContents.send('html-fullscreen', true);
    });

    this.on('leave-html-full-screen', () => {
      this.browserViewManager.fullscreen = false;
      this.webContents.send('html-fullscreen', false);
    });

    this.on('scroll-touch-begin', () => {
      this.webContents.send('scroll-touch-begin');
    });

    this.on('scroll-touch-end', () => {
      this.browserViewManager.selected.webContents.send('scroll-touch-end');
      this.webContents.send('scroll-touch-end');
    });
  }

  public maximize() {
    super.maximize;
    this.browserViewManager.fixBounds();
  }

  public unmaximize() {
    super.unmaximize;
    this.browserViewManager.fixBounds();
  }
}
