import { BrowserWindow, session } from 'electron';

import { getWebUIURL } from '~/common/utils/protocols';
import { BrowserContext } from '../browser-context';

export class OverlayWindow {
  public win: BrowserWindow;

  public constructor(parentWindow: BrowserWindow) {
    this.win = new BrowserWindow({
      frame: false,
      width: 900,
      height: 700,
      transparent: true,
      parent: parentWindow,
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

    this.win.show();
    this.setIgnoreMouseEvents(true);

    this.win.loadURL(getWebUIURL('overlay'));
  }

  public get id() {
    return this.win.id;
  }

  public get webContents() {
    return this.win.webContents;
  }

  public setIgnoreMouseEvents(flag: boolean) {
    this.win.setIgnoreMouseEvents(flag, { forward: false });
  }

  public send(channel: string, ...args: any[]) {
    this.webContents.send(channel, ...args);
  }
}
