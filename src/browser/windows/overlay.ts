import { BrowserWindow, session, Menu, app } from 'electron';

import { getWebUIURL } from '~/common/utils/protocols';
import { BrowserContext } from '../browser-context';
import { resolve } from 'path';
import { getCursorPointRelativeToPoint } from '../utils/point';
import { extensions } from '../extensions';
import { Application } from '../application';

export class OverlayWindow {
  private ignore = false;

  public win: BrowserWindow;

  public regions: number[][] = [];

  public contentBounds: Electron.Rectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  public constructor(parentWindow: BrowserWindow) {
    this.win = new BrowserWindow({
      frame: false,
      width: 900,
      height: 700,
      transparent: true,
      parent: parentWindow,
      resizable: false,
      movable: false,
      webPreferences: {
        plugins: true,
        sandbox: true,
        nodeIntegration: false,
        contextIsolation: false,
        webviewTag: true,
        javascript: true,
        enableRemoteModule: false,
        session: parentWindow.webContents.session,
      },
      skipTaskbar: true,
      show: false,
    });

    this.contentBounds = this.win.getContentBounds();

    this.win.show();
    this.setIgnoreMouseEvents(true);

    this.win.loadURL(getWebUIURL('overlay'));

    if (process.env.NODE_ENV === 'development') {
      this.win.webContents.openDevTools({ mode: 'detach' });
    }

    this.win.webContents.on(
      'will-attach-webview',
      (e, webPreferences, params) => {
        webPreferences.sandbox = true;
        webPreferences.nodeIntegration = false;
        webPreferences.contextIsolation = true;
        webPreferences.enableRemoteModule = false;
        webPreferences.preloadURL = `file:///${resolve(
          app.getAppPath(),
          'build',
          'popup-preload.bundle.js',
        )}`;
      },
    );

    this.win.on('blur', () => {
      extensions.overlayPrivate.sendEventToAll('onBlur');
    });

    const wcCreatedListener = (e, wc) => {
      if (wc.getType() === 'webview') {
        // TODO: extension popup inspect
        // if (inspect) {
        //   wc.openDevTools();
        // }

        // wc.openDevTools();

        wc.on('context-menu', (e, params) => {
          Application.instance.contextMenus.popup([
            {
              type: 'normal',
              title: 'Inspect element',
              onClick: () => {
                wc.inspectElement(params.x, params.y);
              },
            },
          ]);
        });
      }
    };

    app.on('web-contents-created', wcCreatedListener);
  }

  public get id() {
    return this.win.id;
  }

  public get webContents() {
    return this.win.webContents;
  }

  public getCursorPoint() {
    return getCursorPointRelativeToPoint(this.contentBounds);
  }

  public setPopupVisible(name: string, visible: boolean) {
    if (visible) {
      this.win.focus();
    }

    extensions.overlayPrivate.sendEventToAll('onPopupToggled', name, visible);
  }

  public setIgnoreMouseEvents(flag: boolean) {
    if (this.ignore !== flag) {
      this.win.setIgnoreMouseEvents(flag, { forward: false });
      this.ignore = flag;
    }
  }

  public send(channel: string, ...args: any[]) {
    this.webContents.send(channel, ...args);
  }
}
