import { BrowserView, app, ipcMain, Dialog } from 'electron';
import { join } from 'path';
import { SearchDialog } from '../dialogs/search';
import { PreviewDialog } from '../dialogs/preview';
import { PersistentDialog } from '../dialogs/dialog';

interface IDialogShowOptions {
  name: string;
  browserWindow: Electron.BrowserWindow;
  bounds: Electron.Rectangle;
  hideTimeout?: number;
  devtools?: boolean;
  onHide?: (dialog: IDialog) => void;
}

interface IDialog {
  name: string;
  browserView: BrowserView;
  id: number;
  hide: () => void;
}

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
      },
    });

    view.webContents.loadURL(`about:blank`);

    this.browserViews.push(view);

    this.browserViewDetails.set(view.id, false);

    return view;
  }

  public show({
    name,
    browserWindow,
    bounds,
    devtools,
    onHide,
    hideTimeout,
  }: IDialogShowOptions): IDialog {
    const foundDialog = this.dialogs.find((x) => x.name === name);
    if (foundDialog) return foundDialog;

    let browserView = this.browserViews.find(
      (x) => !this.browserViewDetails.get(x.id),
    );

    if (!browserView) {
      browserView = this.createBrowserView();
    }

    browserWindow.webContents.send('dialog-visibility-change', name, true);

    bounds.x = Math.round(bounds.x);
    bounds.y = Math.round(bounds.y);

    browserWindow.addBrowserView(browserView);
    browserView.setBounds(bounds);

    if (process.env.NODE_ENV === 'development') {
      browserView.webContents.loadURL(`http://localhost:4444/${name}.html`);
    } else {
      browserView.webContents.loadURL(
        join('file://', app.getAppPath(), `build/${name}.html`),
      );
    }

    browserView.webContents.focus();

    if (devtools) {
      // browserView.webContents.openDevTools({ mode: 'detach' });
    }

    const dialog = {
      browserView,
      id: browserView.id,
      name,
      hide: () => {
        browserWindow.webContents.send('dialog-visibility-change', name, false);

        ipcMain.removeAllListeners(`hide-${browserView.webContents.id}`);

        this.dialogs = this.dialogs.filter((x) => x.id !== dialog.id);

        browserWindow.removeBrowserView(browserView);

        if (this.browserViews.length > 2) {
          browserView.destroy();
          this.browserViews.splice(2, 1);
          this.browserViewDetails.delete(browserView.id);
        } else {
          browserView.webContents.loadURL('about:blank');
          this.browserViewDetails.set(browserView.id, false);
        }

        if (onHide) onHide(dialog);
      },
    };

    this.browserViewDetails.set(browserView.id, true);

    ipcMain.on(`hide-${browserView.webContents.id}`, () => {
      dialog.hide();
    });

    this.dialogs.push(dialog);

    return dialog;
  }

  public getBrowserViews = () => {
    return this.browserViews.concat(
      Array.from(this.persistentDialogs).map((x) => x.browserView),
    );
  };

  public destroy = () => {
    this.getBrowserViews().forEach((x) => x.destroy());
  };

  public sendToAll = (channel: string, ...args: any[]) => {
    this.getBrowserViews().forEach((x) => x.webContents.send(channel, ...args));
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
