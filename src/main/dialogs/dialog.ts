import { BrowserView, app, ipcMain } from 'electron';
import { join } from 'path';
import { AppWindow } from '../windows';
import { makeId } from '~/utils';

interface IOptions {
  name: string;
  devtools?: boolean;
  bounds?: IRectangle;
  hideTimeout?: number;
  customHide?: boolean;
  webPreferences?: Electron.WebPreferences;
}

interface IRectangle {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export class Dialog extends BrowserView {
  public appWindow: AppWindow;

  public visible = false;

  public bounds: IRectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  private timeout: any;
  private hideTimeout: number;
  private name: string;

  public tabId = -1;

  private loaded = false;
  private showCallback: any = null;

  public constructor(
    appWindow: AppWindow,
    { bounds, name, devtools, hideTimeout, webPreferences }: IOptions,
  ) {
    super({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        ...webPreferences,
      },
    });

    this.appWindow = appWindow;
    this.bounds = { ...this.bounds, ...bounds };
    this.hideTimeout = hideTimeout;
    this.name = name;

    ipcMain.on(`hide-${this.webContents.id}`, (e, showId) => {
      this.hide(false, false);
      this.tabId = -1;
    });

    this.webContents.once('dom-ready', () => {
      this.loaded = true;

      if (this.showCallback) {
        this.showCallback();
        this.showCallback = null;
      }
    });

    if (process.env.NODE_ENV === 'development') {
      this.webContents.loadURL(`http://localhost:4444/${name}.html`);
      if (devtools) {
        this.webContents.openDevTools({ mode: 'detach' });
      }
    } else {
      this.webContents.loadURL(
        join('file://', app.getAppPath(), `build/${name}.html`),
      );
    }
  }

  public rearrange(rect: IRectangle = {}) {
    this.bounds = {
      height: rect.height || this.bounds.height,
      width: rect.width || this.bounds.width,
      x: rect.x || this.bounds.x,
      y: rect.y || this.bounds.y,
    };

    if (this.visible) {
      this.setBounds(this.bounds as any);
    }
  }

  public toggle() {
    if (!this.visible) this.show();
  }

  public show(focus = true) {
    return new Promise(resolve => {
      clearTimeout(this.timeout);

      this.appWindow.webContents.send(
        'dialog-visibility-change',
        this.name,
        true,
      );

      const callback = () => {
        if (this.visible) {
          if (focus) this.webContents.focus();
          return;
        }

        this.visible = true;

        this.appWindow.addBrowserView(this);
        this.rearrange();

        if (focus) this.webContents.focus();

        resolve();
      };

      if (!this.loaded) {
        this.showCallback = callback;
        return;
      }

      callback();
    });
  }

  public hideVisually() {
    this.webContents.send('visible', false);
  }

  public hide(bringToTop = false, hideVisually = true) {
    if (hideVisually) this.hideVisually();

    this.appWindow.webContents.send(
      'dialog-visibility-change',
      this.name,
      false,
    );

    if (!this.visible) return;

    if (bringToTop) {
      this.bringToTop();
    }

    clearTimeout(this.timeout);

    if (this.hideTimeout) {
      this.timeout = setTimeout(() => {
        this.appWindow.removeBrowserView(this);
      }, this.hideTimeout);
    } else {
      this.appWindow.removeBrowserView(this);
    }

    this.visible = false;

    // this.appWindow.fixDragging();
  }

  public bringToTop() {
    this.appWindow.removeBrowserView(this);
    this.appWindow.addBrowserView(this);
  }
}
