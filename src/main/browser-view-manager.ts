import { ipcMain } from 'electron';
import { TOOLBAR_HEIGHT } from '~/renderer/app/constants/design';
import { appWindow } from '.';
import BrowserViewWrapper from './browser-view-wrapper';

declare const global: any;

global.viewsMap = {};

export class BrowserViewManager {
  public views: { [key: number]: BrowserViewWrapper } = {};
  public selectedId = 0;
  public _fullscreen = false;

  public get fullscreen() {
    return this._fullscreen;
  }

  public set fullscreen(val: boolean) {
    this._fullscreen = val;
    this.fixBounds();
  }

  constructor() {
    ipcMain.on(
      'browserview-create',
      (e: Electron.IpcMessageEvent, { tabId, url }: any) => {
        this.create(tabId, url);

        appWindow.webContents.send(`browserview-created-${tabId}`);
      },
    );

    ipcMain.on(
      'browserview-select',
      (e: Electron.IpcMessageEvent, id: number) => {
        const view = this.views[id];
        this.select(id);
        view.updateNavigationState();
      },
    );

    ipcMain.on(
      'browserview-destroy',
      (e: Electron.IpcMessageEvent, id: number) => {
        this.destroy(id);
      },
    );

    ipcMain.on('browserview-call', (e: any, data: any) => {
      const view = this.views[data.tabId];
      const result = (view.webContents as any)[data.method].apply(
        view.webContents,
        data.args,
      );

      if (data.callId) {
        appWindow.webContents.send(
          `browserview-call-result-${data.callId}`,
          result,
        );
      }
    });

    ipcMain.on('browserview-hide', () => {
      this.hideView();
    });

    ipcMain.on('browserview-show', () => {
      this.showView();
    });

    setInterval(() => {
      for (const key in this.views) {
        const view = this.views[key];
        const title = view.webContents.getTitle();
        const url = view.webContents.getURL();

        if (title !== view.title) {
          appWindow.webContents.send(`browserview-data-updated-${key}`, {
            title,
            url,
          });
          view.url = url;
          view.title = title;
        }
      }
    }, 200);

    ipcMain.on('browserview-clear', () => {
      this.clear();
    });
  }

  public get selected() {
    return this.views[this.selectedId];
  }

  public create(tabId: number, url: string) {
    const view = new BrowserViewWrapper(tabId, url);
    this.views[tabId] = view;
    global.viewsMap[view.id] = tabId;
  }

  public clear() {
    appWindow.setBrowserView(null);
    for (const key in this.views) {
      this.destroy(parseInt(key, 10));
    }
  }

  public select(tabId: number) {
    const view = this.views[tabId];
    this.selectedId = tabId;

    if (!view || view.isDestroyed()) {
      this.destroy(tabId);
      appWindow.setBrowserView(null);
      return;
    }

    appWindow.setBrowserView(view);

    view.webContents.focus();

    this.fixBounds();
  }

  public fixBounds() {
    const view = this.views[this.selectedId];

    if (!view) return;

    const { width, height } = appWindow.getContentBounds();
    view.setBounds({
      x: 0,
      y: this.fullscreen ? 0 : TOOLBAR_HEIGHT + 1,
      width,
      height: this.fullscreen ? height : height - TOOLBAR_HEIGHT,
    });
    view.setAutoResize({ width: true, height: true });
  }

  public hideView() {
    appWindow.setBrowserView(null);
  }

  public showView() {
    this.select(this.selectedId);
  }

  public destroy(tabId: number) {
    const view = this.views[tabId];

    if (!view || view.isDestroyed()) {
      delete this.views[tabId];
      return;
    }

    if (appWindow.getBrowserView() === view) {
      appWindow.setBrowserView(null);
    }

    view.destroy();

    delete this.views[tabId];
  }
}
