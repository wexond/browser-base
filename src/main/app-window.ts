import { BrowserWindow, app, ipcMain } from 'electron';
import { resolve, join } from 'path';
import { platform } from 'os';
import { windowManager, Window } from 'node-window-manager';
import * as fileIcon from 'extract-file-icon';

import { ViewManager } from './view-manager';
import { getPath } from '~/shared/utils/paths';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { ProcessWindow } from './models/process-window';
import { TOOLBAR_HEIGHT } from '~/renderer/app/constants/design';
import { runMessagingService } from './services';

const iohook = require('iohook');

const containsPoint = (bounds: any, point: any) => {
  return (
    point.x >= bounds.x &&
    point.y >= bounds.y &&
    point.x <= bounds.x + bounds.width &&
    point.y <= bounds.y + bounds.height
  );
};

export class AppWindow extends BrowserWindow {
  public viewManager: ViewManager = new ViewManager();

  public permissionWindow = new 

  public windows: ProcessWindow[] = [];
  public selectedWindow: ProcessWindow;

  public window: Window;
  public draggedWindow: ProcessWindow;

  public draggedIn = false;
  public detached = false;
  public isMoving = false;
  public isUpdatingContentBounds = false;
  public willAttachWindow = false;
  public isWindowHidden = false;

  public interval: any;

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
        contextIsolation: false,
      },
      icon: resolve(app.getAppPath(), 'static/app-icons/icon.png'),
    });

    runMessagingService(this);

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

    if (windowState) {
      if (windowState.maximized) {
        this.maximize();
      }
      if (windowState.fullscreen) {
        this.setFullScreen(true);
      }
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

    const resize = () => {
      this.viewManager.fixBounds();
      this.webContents.send('tabs-resize');
    };

    this.on('maximize', resize);
    this.on('restore', resize);
    this.on('unmaximize', resize);

    // Save current window state to file.
    this.on('close', () => {
      windowState.maximized = this.isMaximized();
      windowState.fullscreen = this.isFullScreen();
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
      this.viewManager.fixBounds();
    });

    this.on('leave-full-screen', () => {
      this.webContents.send('fullscreen', false);
      this.viewManager.fixBounds();
    });

    this.on('enter-html-full-screen', () => {
      this.viewManager.fullscreen = true;
      this.webContents.send('html-fullscreen', true);
    });

    this.on('leave-html-full-screen', () => {
      this.viewManager.fullscreen = false;
      this.webContents.send('html-fullscreen', false);
    });

    this.on('scroll-touch-begin', () => {
      this.webContents.send('scroll-touch-begin');
    });

    this.on('scroll-touch-end', () => {
      this.viewManager.selected.webContents.send('scroll-touch-end');
      this.webContents.send('scroll-touch-end');
    });

    if (platform() === 'win32') {
      this.activateWindowCapturing();
    }
  }

  public activateWindowCapturing() {
    const updateBounds = () => {
      this.isMoving = true;

      if (!this.isUpdatingContentBounds) {
        this.resizeWindow(this.selectedWindow);
      }
    };

    const handle = this.getNativeWindowHandle().readInt32LE(0);
    this.window = new Window(handle);

    ipcMain.on('select-window', (e: any, id: number) => {
      this.selectWindow(this.windows.find(x => x.id === id));
    });

    ipcMain.on('detach-window', (e: any, id: number) => {
      this.detachWindow(this.windows.find(x => x.id === id));
    });

    ipcMain.on('hide-window', () => {
      if (this.selectedWindow) {
        this.selectedWindow.hide();
        this.isWindowHidden = true;
      }
    });

    this.on('move', updateBounds);
    this.on('resize', updateBounds);

    this.on('close', () => {
      for (const window of this.windows) {
        this.detachWindow(window);
      }
    });

    this.interval = setInterval(this.intervalCallback, 100);

    windowManager.on('window-activated', (window: Window) => {
      this.webContents.send('select-tab', window.id);
    });

    iohook.on('mousedown', () => {
      if (this.isMinimized()) return;

      setTimeout(() => {
        if (this.isFocused()) {
          this.draggedWindow = null;
          return;
        }
        this.draggedWindow = new ProcessWindow(
          windowManager.getActiveWindow().id,
          this,
        );
      }, 50);
    });

    iohook.on('mousedrag', async (e: any) => {
      if (
        this.draggedWindow &&
        this.selectedWindow &&
        this.draggedWindow.id === this.selectedWindow.id &&
        !this.isFocused()
      ) {
        const bounds = this.selectedWindow.getBounds();
        const { lastBounds } = this.selectedWindow;

        if (
          (bounds.x !== lastBounds.x || bounds.y !== lastBounds.y) &&
          bounds.width === lastBounds.width &&
          bounds.height === lastBounds.height
        ) {
          const win = this.selectedWindow;
          this.detachWindow(this.selectedWindow);
          this.detached = true;

          iohook.once('mouseup', () => {
            setTimeout(() => {
              win.setBounds({
                width: win.initialBounds.width,
                height: win.initialBounds.height,
              });
            }, 50);
          });
        } else if (!this.isMoving) {
          this.isUpdatingContentBounds = true;

          this.selectedWindow.lastBounds = bounds;

          this.setContentBounds({
            width: bounds.width,
            height: bounds.height + TOOLBAR_HEIGHT,
            x: bounds.x,
            y: bounds.y - TOOLBAR_HEIGHT,
          } as any);

          this.isMoving = false;
        }
        return;
      }

      if (
        !this.isMinimized() &&
        this.draggedWindow &&
        !this.windows.find(x => x.id === this.draggedWindow.id)
      ) {
        const winBounds = this.draggedWindow.getBounds();
        const { lastBounds } = this.draggedWindow;
        const contentBounds = this.getContentArea();

        e.y = winBounds.y;

        contentBounds.y -= TOOLBAR_HEIGHT;
        contentBounds.height = 2 * TOOLBAR_HEIGHT;
        if (
          !this.detached &&
          containsPoint(contentBounds, e) &&
          (winBounds.x !== lastBounds.x || winBounds.y !== lastBounds.y)
        ) {
          if (!this.draggedIn) {
            const win = this.draggedWindow;
            const title = this.draggedWindow.getTitle();

            win.lastTitle = title;

            this.webContents.send('add-tab', {
              id: win.id,
              title,
              icon: fileIcon(win.path, 16),
            });

            this.draggedIn = true;
            this.willAttachWindow = true;
          }
        } else if (this.draggedIn && !this.detached) {
          this.webContents.send('remove-tab', this.draggedWindow.id);

          this.draggedIn = false;
          this.willAttachWindow = false;
        }
      }
    });

    iohook.on('mouseup', async () => {
      this.isMoving = false;

      if (this.isUpdatingContentBounds) {
        this.resizeWindow(this.selectedWindow);
      }

      this.isUpdatingContentBounds = false;

      if (this.draggedWindow && this.willAttachWindow) {
        const win = this.draggedWindow;

        if (platform() === 'win32') {
          const handle = this.getNativeWindowHandle().readInt32LE(0);
          win.setOwner(handle);
        }

        this.windows.push(win);
        this.willAttachWindow = false;

        setTimeout(() => {
          this.selectWindow(win);
        }, 50);
      }

      this.draggedWindow = null;
      this.detached = false;
    });
  }

  intervalCallback = () => {
    if (!this.isMinimized()) {
      for (const window of this.windows) {
        const title = window.getTitle();
        if (window.lastTitle !== title) {
          this.webContents.send('update-tab-title', {
            id: window.id,
            title,
          });
          window.lastTitle = title;
        }

        if (!window.isWindow()) {
          this.detachWindow(window);
          this.webContents.send('remove-tab', window.id);
        }
      }
    }
  };

  getContentArea() {
    const bounds = this.getContentBounds();

    bounds.y += TOOLBAR_HEIGHT;
    bounds.height -= TOOLBAR_HEIGHT;

    return bounds;
  }

  selectWindow(window: ProcessWindow) {
    if (!window) return;

    if (this.selectedWindow) {
      if (window.id === this.selectedWindow.id && !this.isWindowHidden) {
        return;
      }

      this.selectedWindow.hide();
    }

    window.show();

    this.selectedWindow = window;
    this.isWindowHidden = false;

    this.resizeWindow(window);
  }

  resizeWindow(window: ProcessWindow) {
    if (!window || this.isMinimized()) return;

    const newBounds = this.getContentArea();

    window.setBounds(newBounds);
    window.lastBounds = newBounds;
  }

  detachWindow(window: ProcessWindow) {
    if (!window) return;

    if (this.selectedWindow === window) {
      this.selectedWindow = null;
    }

    window.detach();

    this.windows = this.windows.filter(x => x.id !== window.id);
  }
}
