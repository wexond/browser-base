import { BrowserView, app } from 'electron';
import { join } from 'path';

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
  public dialogs: IDialog[] = [];

  public run() {
    for (let i = 0; i < 2; i++) {
      this.createBrowserView();
    }
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

    this.browserViews.push(view);

    return view;
  }

  public show({
    name,
    browserWindow,
    bounds,
    devtools,
    hideTimeout,
  }: IDialogShowOptions) {
    let browserView = this.browserViews.find((x) =>
      this.dialogs.find((y) => y.browserView !== x),
    );

    if (!browserView) {
      browserView = this.createBrowserView();
    }

    browserWindow.addBrowserView(browserView);
    browserView.setBounds(bounds);

    if (process.env.NODE_ENV === 'development') {
      browserView.webContents.loadURL(`http://localhost:4444/${name}.html`);
    } else {
      browserView.webContents.loadURL(
        join('file://', app.getAppPath(), `build/${name}.html`),
      );
    }

    if (devtools) {
      browserView.webContents.openDevTools({ mode: 'detach' });
    }

    const dialog = {
      browserView,
      id: browserView.id,
      name,
      hide: () => {
        this.dialogs = this.dialogs.filter((x) => x.id !== dialog.id);

        browserWindow.removeBrowserView(browserView);

        if (this.browserViews.length > 2) {
          browserView.destroy();
          this.browserViews.splice(2, 1);
        } else {
          browserView.webContents.loadURL('about:blank');
        }
      },
    };

    this.dialogs.push(dialog);

    return dialog;
  }
}
