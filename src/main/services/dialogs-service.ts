import { BrowserView, app, ipcMain } from 'electron';
import { join } from 'path';
import { SearchDialog } from '../dialogs/search';
import { PreviewDialog } from '../dialogs/preview';
import { PersistentDialog } from '../dialogs/dialog';
import { Application } from '../application';
import { IRectangle } from '~/interfaces';

interface IDialogTabAssociation {
  tabId?: number;
  getTabInfo?: (tabId: number) => any;
  setTabInfo?: (tabId: number, ...args: any[]) => void;
}

type BoundsDisposition = 'move' | 'resize';

interface IDialogShowOptions {
  name: string;
  browserWindow: Electron.BrowserWindow;
  hideTimeout?: number;
  devtools?: boolean;
  tabAssociation?: IDialogTabAssociation;
  onWindowBoundsUpdate?: (disposition: BoundsDisposition) => void;
  onHide?: (dialog: IDialog) => void;
  getBounds: () => IRectangle;
}

interface IDialog {
  name: string;
  browserView: BrowserView;
  id: number;
  tabIds: number[];
  _sendTabInfo: (tabId: number) => void;
  hide: (tabId?: number) => void;
  handle: (name: string, cb: (...args: any[]) => any) => void;
  on: (name: string, cb: (...args: any[]) => any) => void;
  rearrange: (bounds?: IRectangle) => void;
}

export const roundifyRectangle = (rect: IRectangle): IRectangle => {
  const newRect: any = { ...rect };
  Object.keys(newRect).forEach((key) => {
    if (!isNaN(newRect[key])) newRect[key] = Math.round(newRect[key]);
  });
  return newRect;
};

export class DialogsService {
  public browserViews: BrowserView[] = [];
  public browserViewDetails = new Map<number, boolean>();
  public dialogs: IDialog[] = [];

  public persistentDialogs: PersistentDialog[] = [];

  public run() {
    this.createBrowserView();

    this.persistentDialogs.push(new SearchDialog());
    this.persistentDialogs.push(new PreviewDialog());
  }

  private createBrowserView() {
    const view = new BrowserView({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        webviewTag: true,
        worldSafeExecuteJavaScript: false,
      },
    });

    view.webContents.loadURL(`about:blank`);

    this.browserViews.push(view);

    this.browserViewDetails.set(view.webContents.id, false);

    return view;
  }

  public show(options: IDialogShowOptions): IDialog {
    const {
      name,
      browserWindow,
      getBounds,
      devtools,
      onHide,
      hideTimeout,
      onWindowBoundsUpdate,
      tabAssociation,
    } = options;

    const foundDialog = this.getDynamic(name);

    let browserView = foundDialog
      ? foundDialog.browserView
      : this.browserViews.find(
          (x) => !this.browserViewDetails.get(x.webContents.id),
        );

    if (!browserView) {
      browserView = this.createBrowserView();
    }

    const appWindow = Application.instance.windows.fromBrowserWindow(
      browserWindow,
    );

    if (foundDialog && tabAssociation) {
      foundDialog.tabIds.push(tabAssociation.tabId);
      foundDialog._sendTabInfo(tabAssociation.tabId);
    }

    browserWindow.webContents.send('dialog-visibility-change', name, true);

    this.browserViewDetails.set(browserView.webContents.id, true);

    if (foundDialog) {
      browserWindow.addBrowserView(browserView);
      foundDialog.rearrange();
      return null;
    }

    browserWindow.addBrowserView(browserView);
    browserView.setBounds({ x: 0, y: 0, width: 1, height: 1 });

    if (devtools) {
      browserView.webContents.openDevTools({ mode: 'detach' });
    }

    const tabsEvents: {
      activate?: (id: number) => void;
      remove?: (id: number) => void;
    } = {};

    const windowEvents: {
      resize?: () => void;
      move?: () => void;
    } = {};

    const channels: string[] = [];

    const dialog: IDialog = {
      browserView,
      id: browserView.webContents.id,
      name,
      tabIds: [tabAssociation?.tabId],
      _sendTabInfo: (tabId) => {
        if (tabAssociation.getTabInfo) {
          const data = tabAssociation.getTabInfo(tabId);
          browserView.webContents.send('update-tab-info', tabId, data);
        }
      },
      hide: (tabId) => {
        const { selectedId } = appWindow.viewManager;

        dialog.tabIds = dialog.tabIds.filter(
          (x) => x !== (tabId || selectedId),
        );

        if (tabId && tabId !== selectedId) return;

        browserWindow.webContents.send('dialog-visibility-change', name, false);

        browserWindow.removeBrowserView(browserView);

        if (tabAssociation && dialog.tabIds.length > 0) return;

        ipcMain.removeAllListeners(`hide-${browserView.webContents.id}`);
        channels.forEach((x) => {
          ipcMain.removeHandler(x);
          ipcMain.removeAllListeners(x);
        });

        this.dialogs = this.dialogs.filter((x) => x.id !== dialog.id);

        this.browserViewDetails.set(browserView.webContents.id, false);

        if (this.browserViews.length > 1) {
          // TODO: garbage collect unused BrowserViews?
          // this.browserViewDetails.delete(browserView.id);
          // browserView.destroy();
          // this.browserViews.splice(1, 1);
        } else {
          browserView.webContents.loadURL('about:blank');
        }

        if (tabAssociation) {
          appWindow.viewManager.off('activated', tabsEvents.activate);
          appWindow.viewManager.off('removed', tabsEvents.remove);
        }

        browserWindow.removeListener('resize', windowEvents.resize);
        browserWindow.removeListener('move', windowEvents.move);

        if (onHide) onHide(dialog);
      },
      handle: (name, cb) => {
        const channel = `${name}-${browserView.webContents.id}`;
        ipcMain.handle(channel, (...args) => cb(...args));
        channels.push(channel);
      },
      on: (name, cb) => {
        const channel = `${name}-${browserView.webContents.id}`;
        ipcMain.on(channel, (...args) => cb(...args));
        channels.push(channel);
      },
      rearrange: (rect) => {
        rect = rect || {};
        browserView.setBounds({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          ...roundifyRectangle(getBounds()),
          ...roundifyRectangle(rect),
        });
      },
    };

    tabsEvents.activate = (id) => {
      const visible = dialog.tabIds.includes(id);
      browserWindow.webContents.send('dialog-visibility-change', name, visible);

      if (visible) {
        dialog._sendTabInfo(id);
        browserWindow.removeBrowserView(browserView);
        browserWindow.addBrowserView(browserView);
      } else {
        browserWindow.removeBrowserView(browserView);
      }
    };

    tabsEvents.remove = (id) => {
      dialog.hide(id);
    };

    const emitWindowBoundsUpdate = (type: BoundsDisposition) => {
      if (
        tabAssociation &&
        !dialog.tabIds.includes(appWindow.viewManager.selectedId)
      ) {
        onWindowBoundsUpdate(type);
      }
    };

    windowEvents.move = () => {
      emitWindowBoundsUpdate('move');
    };

    windowEvents.resize = () => {
      emitWindowBoundsUpdate('resize');
    };

    if (tabAssociation) {
      appWindow.viewManager.on('removed', tabsEvents.remove);
      appWindow.viewManager.on('activated', tabsEvents.activate);
    }

    if (onWindowBoundsUpdate) {
      browserWindow.on('resize', windowEvents.resize);
      browserWindow.on('move', windowEvents.move);
    }

    browserView.webContents.once('dom-ready', () => {
      dialog.rearrange();
      browserView.webContents.focus();
    });

    if (process.env.NODE_ENV === 'development') {
      browserView.webContents.loadURL(`http://localhost:4444/${name}.html`);
    } else {
      browserView.webContents.loadURL(
        join('file://', app.getAppPath(), `build/${name}.html`),
      );
    }

    ipcMain.on(`hide-${browserView.webContents.id}`, () => {
      dialog.hide();
    });

    if (tabAssociation) {
      dialog.on('loaded', () => {
        dialog._sendTabInfo(tabAssociation.tabId);
      });

      if (tabAssociation.setTabInfo) {
        dialog.on('update-tab-info', (e, tabId, ...args) => {
          tabAssociation.setTabInfo(tabId, ...args);
        });
      }
    }

    this.dialogs.push(dialog);

    return dialog;
  }

  public getBrowserViews = () => {
    return this.browserViews.concat(
      Array.from(this.persistentDialogs).map((x) => x.browserView),
    );
  };

  public destroy = () => {
    this.getBrowserViews().forEach((x) => (x.webContents as any).destroy());
  };

  public sendToAll = (channel: string, ...args: any[]) => {
    this.getBrowserViews().forEach(
      (x) =>
        !x.webContents.isDestroyed() && x.webContents.send(channel, ...args),
    );
  };

  public get(name: string) {
    return this.getDynamic(name) || this.getPersistent(name);
  }

  public getDynamic(name: string) {
    return this.dialogs.find((x) => x.name === name);
  }

  public getPersistent(name: string) {
    return this.persistentDialogs.find((x) => x.name === name);
  }

  public isVisible = (name: string) => {
    return this.getDynamic(name) || this.getPersistent(name)?.visible;
  };
}
