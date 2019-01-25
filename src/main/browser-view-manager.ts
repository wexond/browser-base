import { BrowserView, ipcMain, app } from 'electron';
import { TOOLBAR_HEIGHT } from '~/renderer/app/constants/design';
import { appWindow } from '.';
import BrowserViewWrapper from './browser-view-wrapper';

export class BrowserViewManager {
  public views: { [key: number]: BrowserViewWrapper } = {};
  public selectedId = 0;

  constructor() {
    ipcMain.on(
      'browserview-create',
      (e: Electron.IpcMessageEvent, tabId: number) => {
        this.create(tabId);

        appWindow.window.webContents.send(`browserview-created-${tabId}`);
      },
    );

    ipcMain.on(
      'browserview-select',
      (e: Electron.IpcMessageEvent, id: number) => {
        this.select(id);
        this.updateNavigationState(id);
      },
    );

    ipcMain.on(
      'browserview-remove',
      (e: Electron.IpcMessageEvent, id: number) => {
        this.remove(id);
      },
    );

    setInterval(() => {
      for (const key in this.views) {
        const view = this.views[key];
        const title = view.webContents.getTitle();

        if (title !== view.title) {
          appWindow.window.webContents.send(
            `browserview-title-updated-${key}`,
            title,
          );
          view.title = title;
        }
      }
    }, 200);

    ipcMain.on(
      'browserview-navigation-action',
      (e: Electron.IpcMessageEvent, data: any) => {
        const { id, action } = data;

        const view = this.views[id];

        switch (action) {
          case 'back':
            view.webContents.goBack();
            break;
          case 'forward':
            view.webContents.goForward();
            break;
          case 'refresh':
            view.webContents.reload();
            break;
        }
      },
    );

    ipcMain.on('browserview-clear', () => {
      this.clear();
    });
  }

  public updateNavigationState(tabId: number) {
    const view = this.views[tabId];

    if (!view || view.isDestroyed()) {
      return;
    }

    if (this.selectedId === tabId) {
      appWindow.window.webContents.send('update-navigation-state', {
        canGoBack: view.webContents.canGoBack(),
        canGoForward: view.webContents.canGoForward(),
      });
    }
  }

  public create(tabId: number) {
    const view = new BrowserView();

    view.webContents.addListener('destroyed', () => {
      delete this.views[tabId];
    });

    view.webContents.addListener('did-stop-loading', () => {
      this.updateNavigationState(tabId);
    });

    view.webContents.addListener('did-start-loading', () => {
      this.updateNavigationState(tabId);
    });

    view.setAutoResize({ width: true, height: true });
    view.webContents.loadURL('https://google.com');

    this.views[tabId] = view as BrowserViewWrapper;
  }

  public clear() {
    appWindow.window.setBrowserView(null);
    for (const key in this.views) {
      this.remove(parseInt(key, 10));
    }
  }

  public select(tabId: number) {
    const view = this.views[tabId];
    this.selectedId = tabId;

    if (!view || view.isDestroyed()) {
      appWindow.window.setBrowserView(null);
      return;
    }

    appWindow.window.setBrowserView(view);

    const { width, height } = appWindow.window.getContentBounds();
    view.setBounds({
      x: 0,
      y: TOOLBAR_HEIGHT + 1,
      width,
      height: height - TOOLBAR_HEIGHT,
    });
  }

  public remove(tabId: number) {
    const view = this.views[tabId];
    if (!view || view.isDestroyed()) return;
    if (appWindow.window.getBrowserView() === view) {
      appWindow.window.setBrowserView(null);
    }

    view.destroy();
  }
}
