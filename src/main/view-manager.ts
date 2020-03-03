import { ipcMain } from 'electron';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { View } from './view';
import { AppWindow } from './windows';
import { WEBUI_BASE_URL } from '~/constants/files';
import { windowsManager } from '.';
import { NEWTAB_URL } from '~/constants/tabs';

export class ViewManager {
  public views = new Map<number, View>();
  public selectedId = 0;
  public _fullscreen = false;

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
    ipcMain.handle(`view-create-${id}`, (e, details) => {
      return this.create(details, false, false).webContents.id;
    });

    ipcMain.handle(`views-create-${id}`, (e, options) => {
      return options.map((option: any) => {
        return this.create(option, false, false).webContents.id;
      });
    });

    ipcMain.on(`add-tab-${id}`, (e, details) => {
      this.create(details);
    });

    ipcMain.on(`view-select-${id}`, (e, id: number) => {
      const view = this.views.get(id);
      this.select(id);
      view.updateNavigationState();
    });

    ipcMain.on(`view-destroy-${id}`, (e, id: number) => {
      this.destroy(id);
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
      r.webContents.getURL().startsWith(`${WEBUI_BASE_URL}settings`),
    );
  }

  public create(
    details: chrome.tabs.CreateProperties,
    isNext = false,
    sendMessage = true,
  ) {
    const view = new View(this.window, details.url, this.incognito);
    const { id } = view.webContents;

    view.webContents.once('destroyed', () => {
      this.views.delete(id);
    });

    this.views.set(view.webContents.id, view);

    if (sendMessage) {
      this.window.webContents.send(
        'create-tab',
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
    const { selected } = this;
    const view = this.views.get(id);

    if (!view) {
      return;
    }

    this.selectedId = id;

    view.updateWindowTitle();
    view.updateBookmark();

    if (this.incognito) {
      windowsManager.sessionsManager.extensionsIncognito.activeTab = id;
    } else {
      windowsManager.sessionsManager.extensions.activeTab = id;
    }

    this.window.removeBrowserView(selected);
    this.window.addBrowserView(view);

    if (this.window.dialogs.previewDialog.visible) {
      this.window.dialogs.previewDialog.hide(true);
    }

    // Also fixes switching tabs with Ctrl + Tab
    view.webContents.focus();

    if (view.webContents.getURL().startsWith(NEWTAB_URL)) {
      this.window.dialogs.searchDialog.bringToTop();
      this.window.dialogs.searchDialog.show();
    } else if (this.window.dialogs.searchDialog.visible) {
      this.window.dialogs.searchDialog.hide(true);
    }

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

  public destroy(id: number) {
    const view = this.views.get(id);

    if (view && !view.isDestroyed()) {
      this.window.removeBrowserView(view);
      view.destroy();
    }
  }
}
