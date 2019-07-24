import { ipcMain, session } from 'electron';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants/design';
import { log } from '.';
import { View } from './view';
import { AppWindow } from './windows';

export class ViewManager {
  public views: View[] = [];
  public selectedId = 0;
  public _fullscreen = false;

  public isHidden = false;

  public get fullscreen() {
    return this._fullscreen;
  }

  public set fullscreen(val: boolean) {
    this._fullscreen = val;
    this.fixBounds();
  }

  constructor(public window: AppWindow) {
    ipcMain.on('view-create', (e, details: chrome.tabs.CreateProperties) => {
      this.create(details);
    });

    ipcMain.on('view-select', (e, id: number, force: boolean) => {
      const view = this.views.find(x => x.webContents.id === id);
      this.select(id);
      view.updateNavigationState();

      if (force) this.isHidden = false;
    });

    ipcMain.on('clear-browsing-data', () => {
      const ses = session.fromPartition('persist:view');
      ses.clearCache((err: any) => {
        if (err) log.error(err);
      });

      ses.clearStorageData({
        storages: [
          'appcache',
          'cookies',
          'filesystem',
          'indexdb',
          'localstorage',
          'shadercache',
          'websql',
          'serviceworkers',
          'cachestorage',
        ],
      });
    });

    ipcMain.on('view-destroy', (e, id: number) => {
      this.destroy(id);
    });

    ipcMain.on('browserview-call', async (e: any, data: any) => {
      const view = this.views.find(x => x.webContents.id === data.tabId);
      let scope: any = view;

      if (data.scope && data.scope.trim() !== '') {
        const scopes = data.scope.split('.');
        for (const s of scopes) {
          scope = scope[s];
        }
      }

      let result = scope.apply(view.webContents, data.args);

      if (result instanceof Promise) {
        result = await result;
      }

      if (data.callId) {
        this.window.webContents.send(
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
      for (const view of this.views) {
        const url = view.webContents.getURL();

        if (url !== view.url) {
          this.window.webContents.send(
            `view-url-updated-${view.webContents.id}`,
            url,
          );
          view.url = url;
        }
      }
    }, 200);

    ipcMain.on('browserview-clear', () => {
      this.clear();
    });
  }

  public get selected() {
    return this.views.find(x => x.webContents.id === this.selectedId);
  }

  public create(details: chrome.tabs.CreateProperties, isNext = false) {
    const view = new View(this.window, details.url);
    this.views.push(view);

    this.window.webContents.send(
      'api-tabs-create',
      { ...details },
      isNext,
      view.webContents.id,
    );

    return view;
  }

  public clear() {
    this.window.setBrowserView(null);
    for (const key in this.views) {
      this.destroy(parseInt(key, 10));
    }
  }

  public select(id: number) {
    const view = this.views.find(x => x.webContents.id === id);
    this.selectedId = id;

    if (!view || view.isDestroyed()) {
      this.destroy(id);
      this.window.setBrowserView(null);
      return;
    }

    if (this.isHidden) return;

    this.window.setBrowserView(view);

    this.fixBounds();
  }

  public fixBounds() {
    const view = this.selected;

    if (!view) return;

    const { width, height } = this.window.getContentBounds();
    view.setBounds({
      x: 0,
      y: this.fullscreen ? 0 : TOOLBAR_HEIGHT + 1,
      width,
      height: this.fullscreen ? height : height - TOOLBAR_HEIGHT,
    });
    view.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });
  }

  public hideView() {
    this.isHidden = true;
    this.window.setBrowserView(null);
  }

  public showView() {
    this.isHidden = false;
    this.select(this.selectedId);
  }

  public destroy(id: number) {
    const view = this.views.find(x => x.webContents.id === id);

    this.views = this.views.filter(x => x.webContents.id !== id);

    if (view) {
      if (this.window.getBrowserView() === view) {
        this.window.setBrowserView(null);
      }

      view.destroy();
    }
  }
}
