import { ipcMain } from 'electron';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { View } from './view';
import { AppWindow } from './windows';
import { WEBUI_BASE_URL } from '~/constants/files';
import { Application } from './application';

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

    const { id } = window.win;
    ipcMain.handle(`view-create-${id}`, (e, details) => {
      return this.create(details, false, false).id;
    });

    ipcMain.handle(`views-create-${id}`, (e, options) => {
      return options.map((option: any) => {
        return this.create(option, false, false).id;
      });
    });

    ipcMain.on(`add-tab-${id}`, (e, details) => {
      this.create(details);
    });

    ipcMain.on('Print', (e, details) => {
      this.views.get(this.selectedId).webContents.print();
    });

    ipcMain.handle(`view-select-${id}`, (e, id: number) => {
      this.select(id);
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
    return Object.values(this.views).find((r) =>
      r.url.startsWith(`${WEBUI_BASE_URL}settings`),
    );
  }

  public create(
    details: chrome.tabs.CreateProperties,
    isNext = false,
    sendMessage = true,
  ) {
    const view = new View(this.window, details.url, this.incognito);

    const { webContents } = view.browserView;
    const { id } = view;

    this.views.set(id, view);

    webContents.once('destroyed', () => {
      this.views.delete(id);
    });

    if (sendMessage) {
      this.window.send('create-tab', { ...details }, isNext, id);
    }

    return view;
  }

  public clear() {
    this.window.win.setBrowserView(null);
    Object.values(this.views).forEach((x) => x.destroy());
  }

  public select(id: number) {
    const { selected } = this;
    const view = this.views.get(id);

    if (!view) {
      return;
    }

    this.selectedId = id;

    if (selected) {
      this.window.win.removeBrowserView(selected.browserView);
    }

    this.window.win.addBrowserView(view.browserView);

    // Also fixes switching tabs with Ctrl + Tab
    view.webContents.focus();

    if (view.webContents.getURL().startsWith(NEWTAB_URL) || view.isNewTab) {
      this.window.dialogs.searchDialog.bringToTop();
      this.window.dialogs.searchDialog.show();
    } else {
      if (this.window.dialogs.searchDialog.visible) {
        this.window.dialogs.searchDialog.hide(true);
      }
    }

    this.window.dialogs.previewDialog.hide(true);

    [
      'findDialog',
      'authDialog',
      'permissionsDialog',
      'formFillDialog',
      'credentialsDialog',
    ].forEach((dialog) => {
      if (this.window.dialogs[dialog].tabIds.includes(id)) {
        this.window.dialogs[dialog].show();
      } else {
        this.window.dialogs[dialog].hide();
      }
    });

    this.window.updateTitle();
    view.updateBookmark();

    if (this.incognito) {
      Application.instance.sessions.viewIncognito.activeTab = id;
    } else {
      Application.instance.sessions.view.activeTab = id;
    }

    this.fixBounds();

    view.updateNavigationState();
  }

  public fixBounds() {
    const view = this.selected;

    if (!view) return;

    const { width, height } = this.window.win.getContentBounds();

    const newBounds = {
      x: 0,
      y: this.fullscreen ? 0 : TOOLBAR_HEIGHT + 1,
      width,
      height: this.fullscreen ? height : height - TOOLBAR_HEIGHT,
    };

    if (newBounds !== view.bounds) {
      view.browserView.setBounds(newBounds);
      view.bounds = newBounds;
    }
  }

  public destroy(id: number) {
    const view = this.views.get(id);

    if (view && !view.browserView.isDestroyed()) {
      this.window.win.removeBrowserView(view.browserView);
      view.destroy();
    }
  }
}
