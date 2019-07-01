import { platform } from 'os';
import * as fileIcon from 'extract-file-icon';
import { ipcMain } from 'electron';

import { ProcessWindow } from '../models';
import { AppWindow } from '../windows';
import { windowManager, Window } from 'node-window-manager';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants/design';
import { settings } from '..';

const iohook = require('iohook');

const containsPoint = (bounds: any, point: any) => {
  return (
    point.x >= bounds.x &&
    point.y >= bounds.y &&
    point.x <= bounds.x + bounds.width &&
    point.y <= bounds.y + bounds.height
  );
};

export class Multrin {
  public windows: ProcessWindow[] = [];

  public selectedWindow: ProcessWindow;
  public draggedWindow: ProcessWindow;

  public draggedIn = false;
  public detached = false;
  public isMoving = false;
  public isUpdatingContentBounds = false;
  public willAttachWindow = false;
  public isWindowHidden = false;

  public interval: any;

  constructor(public appWindow: AppWindow) {
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

    this.appWindow.on('move', updateBounds);
    this.appWindow.on('resize', updateBounds);

    this.appWindow.on('close', () => {
      for (const window of this.windows) {
        this.detachWindow(window);
      }
    });

    this.interval = setInterval(this.intervalCallback, 100);

    windowManager.on('window-activated', (window: Window) => {
      this.appWindow.webContents.send('select-tab', window.id);
    });

    iohook.on('mousedown', () => {
      if (this.appWindow.isMinimized()) return;

      setTimeout(() => {
        if (this.appWindow.isFocused()) {
          this.draggedWindow = null;
          return;
        }
        this.draggedWindow = new ProcessWindow(
          windowManager.getActiveWindow().id,
          this.appWindow,
        );
      }, 50);
    });

    iohook.on('mousedrag', async (e: any) => {
      if (
        this.draggedWindow &&
        this.selectedWindow &&
        this.draggedWindow.id === this.selectedWindow.id &&
        !this.appWindow.isFocused()
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

          this.appWindow.setContentBounds({
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
        !this.appWindow.isMinimized() &&
        this.draggedWindow &&
        !this.windows.find(x => x.id === this.draggedWindow.id) &&
        settings.multrinToggled
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

            this.appWindow.webContents.send('add-tab', {
              id: win.id,
              title,
              icon: fileIcon(win.path, 16),
            });

            this.draggedIn = true;
            this.willAttachWindow = true;
          }
        } else if (this.draggedIn && !this.detached) {
          this.appWindow.webContents.send('remove-tab', this.draggedWindow.id);

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
          const handle = this.appWindow.getNativeWindowHandle().readInt32LE(0);
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
    if (!this.appWindow.isMinimized()) {
      for (const window of this.windows) {
        const title = window.getTitle();
        if (window.lastTitle !== title) {
          this.appWindow.webContents.send('update-tab-title', {
            id: window.id,
            title,
          });
          window.lastTitle = title;
        }

        if (!window.isWindow()) {
          this.detachWindow(window);
          this.appWindow.webContents.send('remove-tab', window.id);
        }
      }
    }
  };

  getContentArea() {
    const bounds = this.appWindow.getContentBounds();

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
    if (!window || this.appWindow.isMinimized()) return;

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
