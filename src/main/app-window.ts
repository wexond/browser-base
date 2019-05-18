import { BrowserWindow, app, ipcMain, globalShortcut, screen } from 'electron';
import { resolve, join } from 'path';
import { platform } from 'os';
import { windowManager, Window } from 'node-window-manager';
import mouseEvents from 'mouse-hooks';

import { ViewManager } from './view-manager';
import { getPath } from '~/shared/utils/paths';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { ProcessWindow } from './models/process-window';
import { TOOLBAR_HEIGHT } from '~/renderer/app/constants/design';
import { log } from '.';

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

    this.on('move', updateBounds);
    this.on('resize', updateBounds);

    this.on('close', () => {
      for (const window of this.windows) {
        this.detachWindow(window);
      }
    });

    this.interval = setInterval(this.intervalCallback, 100);

    windowManager.on('window-activated', (window: Window) => {
      this.webContents.send('select-tab', window.handle);

      if (
        window.handle === handle ||
        (this.selectedWindow && window.handle === this.selectedWindow.handle)
      ) {
        if (!globalShortcut.isRegistered('CmdOrCtrl+Tab')) {
          globalShortcut.register('CmdOrCtrl+Tab', () => {
            this.webContents.send('next-tab');
          });
        }
      } else if (globalShortcut.isRegistered('CmdOrCtrl+Tab')) {
        globalShortcut.unregister('CmdOrCtrl+Tab');
      }
    });

    mouseEvents.on('mouse-down', () => {
      if (this.isMinimized()) return;

      setTimeout(() => {
        this.draggedWindow = new ProcessWindow(
          windowManager.getActiveWindow().handle,
        );

        if (this.draggedWindow.handle === handle) {
          this.draggedWindow = null;
          return;
        }
      }, 50);
    });

    mouseEvents.on('mouse-up', async data => {
      if (this.selectedWindow && !this.isMoving) {
        const bounds = this.selectedWindow.getBounds();
        const { lastBounds } = this.selectedWindow;

        if (
          !this.isMaximized() &&
          (bounds.width !== lastBounds.width ||
            bounds.height !== lastBounds.height)
        ) {
          this.isUpdatingContentBounds = true;

          clearInterval(this.interval);

          const sf = windowManager.getScaleFactor(this.window.getMonitor());

          this.selectedWindow.lastBounds = bounds;

          this.setContentBounds({
            width: bounds.width,
            height: bounds.height + TOOLBAR_HEIGHT,
            x: bounds.x,
            y: bounds.y - TOOLBAR_HEIGHT - 1,
          });

          this.interval = setInterval(this.intervalCallback, 100);

          this.isUpdatingContentBounds = false;
        }
      }

      this.isMoving = false;

      if (this.draggedWindow && this.willAttachWindow) {
        const win = this.draggedWindow;

        win.setOwner(this.window);

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
    if (this.isMoving) return;

    if (!this.isMinimized()) {
      for (const window of this.windows) {
        const title = window.getTitle();
        if (window.lastTitle !== title) {
          this.webContents.send('update-tab-title', {
            id: window.handle,
            title,
          });
          window.lastTitle = title;
        }

        if (!window.isWindow()) {
          this.detachWindow(window);
          this.webContents.send('remove-tab', window.handle);
        }
      }

      if (this.selectedWindow) {
        const contentBounds = this.getContentArea();
        const bounds = this.selectedWindow.getBounds();
        const { lastBounds } = this.selectedWindow;

        if (
          (contentBounds.x !== bounds.x || contentBounds.y !== bounds.y) &&
          (bounds.width === lastBounds.width &&
            bounds.height === lastBounds.height)
        ) {
          const window = this.selectedWindow;
          this.detachWindow(window);
          this.detached = true;
        }
      }
    }

    if (
      !this.isMinimized() &&
      this.draggedWindow &&
      this.draggedWindow.getOwner().handle === 0 &&
      !this.windows.find(x => x.handle === this.draggedWindow.handle)
    ) {
      const winBounds = this.draggedWindow.getBounds();
      const { lastBounds } = this.draggedWindow;
      const contentBounds = this.getContentArea();
      const cursor = screen.getCursorScreenPoint();

      cursor.y = winBounds.y;

      contentBounds.y -= TOOLBAR_HEIGHT;
      contentBounds.height = 2 * TOOLBAR_HEIGHT;

      if (
        !this.detached &&
        containsPoint(contentBounds, cursor) &&
        (winBounds.x !== lastBounds.x || winBounds.y !== lastBounds.y)
      ) {
        if (!this.draggedIn) {
          const title = this.draggedWindow.getTitle();
          app.getFileIcon(this.draggedWindow.process.path, (err, icon) => {
            if (err) return log.error(err);

            this.draggedWindow.lastTitle = title;

            this.webContents.send('add-tab', {
              id: this.draggedWindow.handle,
              title,
              icon: icon.toPNG(),
            });

            this.draggedIn = true;
            this.willAttachWindow = true;
          });
        }
      } else if (this.draggedIn && !this.detached) {
        this.webContents.send('remove-tab', this.draggedWindow.handle);

        this.draggedIn = false;
        this.willAttachWindow = false;
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
      if (
        window.handle === this.selectedWindow.handle &&
        !this.isWindowHidden
      ) {
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

    const bounds = window.getBounds();

    if (bounds.width > newBounds.width || bounds.height > newBounds.height) {
      this.setContentSize(bounds.width, bounds.height + TOOLBAR_HEIGHT);
      this.setMinimumSize(bounds.width, bounds.height + TOOLBAR_HEIGHT);
    }
  }

  detachWindow(window: ProcessWindow) {
    if (!window) return;

    if (this.selectedWindow === window) {
      this.selectedWindow = null;
    }

    window.detach();

    this.windows = this.windows.filter(x => x.handle !== window.handle);
  }
}
