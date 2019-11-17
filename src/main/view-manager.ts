import { ipcMain } from 'electron';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { View } from './view';
import { AppWindow } from './windows';

export class ViewManager {
  public views = new Map<number, View>();
  public selectedId = 0;
  public _fullscreen = false;

  public isHidden = false;
  public incognito: boolean;

  private window: AppWindow;

  public get fullscreen() {
    return this._fullscreen;
  }

  public set fullscreen(val: boolean) {
    this._fullscreen = val;
    this.fixBounds();
  }

  public constructor(window: AppWindow, incognito: boolean) {
    this.window = window;
    this.incognito = incognito;

    const { id } = window;
    ipcMain.handle(
      `view-create-${id}`,
      (e, details: chrome.tabs.CreateProperties) => {
        console.log(details);
        return this.create(details, false, false).webContents.id;
      },
    );

    ipcMain.on(`view-select-${id}`, (e, id: number, force: boolean) => {
      const view = this.views.get(id);
      this.select(id);
      view.updateNavigationState();

      if (force) this.isHidden = false;
    });

    ipcMain.on(`view-destroy-${id}`, (e, id: number) => {
      this.destroy(id);
    });

    ipcMain.on(`browserview-call-${id}`, async (e, data) => {
      const view = this.views.get(data.tabId);
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

    ipcMain.on(`browserview-hide-${id}`, () => {
      this.hideView();
    });

    ipcMain.on(`browserview-show-${id}`, () => {
      this.showView();
    });

    ipcMain.on(`mute-view-${id}`, (e, tabId: number) => {
      const view = this.views.get(tabId);
      view.webContents.setAudioMuted(true);
    });

    ipcMain.on(`unmute-view-${id}`, (e, tabId: number) => {
      const view = this.views.get(tabId);
      view.webContents.setAudioMuted(false);
    });

    ipcMain.on(`browserview-clear-${id}`, () => {
      this.clear();
    });
  }

  public get selected() {
    return this.views.get(this.selectedId);
  }

  public get settingsView() {
    return Object.values(this.views).find(r =>
      r.webContents.getURL().startsWith('wexond://settings'),
    );
  }

  public create(
    details: chrome.tabs.CreateProperties,
    isNext = false,
    sendMessage = true,
  ) {
    const view = new View(this.window, details.url, this.incognito);

    view.setAutoResize({
      width: true,
      height: true,
    } as any);

    this.views.set(view.webContents.id, view);

    if (sendMessage) {
      this.window.webContents.send(
        'api-tabs-create',
        { ...details },
        isNext,
        view.webContents.id,
      );
    }

    return view;
  }

  public clear() {
    this.window.setBrowserView(null);
    Object.values(this.views).forEach(x => x.destroy());
  }

  public select(id: number) {
    const selected = this.selected;
    const view = this.views.get(id);
    this.selectedId = id;

    if (this.isHidden) return;

    view.selected = true;
    view.updateWindowTitle();

    if (selected) {
      selected.selected = false;
    }

    this.window.setBrowserView(view);

    this.fixBounds();
  }

  public fixBounds() {
    const view = this.selected;

    if (!view) return;

    const { width, height } = this.window.getContentBounds();

    const newBounds = {
      x: 0,
      y: this.fullscreen ? 0 : TOOLBAR_HEIGHT + 1,
      width,
      height: this.fullscreen ? height : height - TOOLBAR_HEIGHT,
    };

    if (newBounds !== view.bounds) {
      view.setBounds(newBounds);
      view.bounds = newBounds;
    }
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
    const view = this.views.get(id);
    this.views.delete(id);

    if (view) {
      this.window.removeBrowserView(view);
      view.destroy();
    }
  }
}
