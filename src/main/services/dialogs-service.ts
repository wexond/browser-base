import { BrowserView, app, ipcMain } from 'electron';
import { join } from 'path';
import { SearchDialog } from '../dialogs/search';

interface IDialogShowOptions {
  name: string;
  browserWindow: Electron.BrowserWindow;
  bounds: Electron.Rectangle;
  hideTimeout?: number;
  devtools?: boolean;
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

  public searchBox: SearchDialog;

  public run() {
    this.createBrowserView();

    this.searchBox = new SearchDialog();
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
    return this.browserViews.concat([this.searchBox.browserView]);
  };

  public destroy = () => {
    this.getBrowserViews().forEach((x) => x.destroy());
  };

  public sendToAll = (channel: string, ...args: any[]) => {
    this.getBrowserViews().forEach((x) => x.webContents.send(channel, ...args));
  };

  public isVisible = (name: string) => {
    return this.dialogs.find((x) => x.name === name);
  };
}
