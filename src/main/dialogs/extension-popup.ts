import { AppWindow } from '../windows';
import { Dialog } from '.';
import { ipcMain } from 'electron';

export class ExtensionPopup extends Dialog {
  public visible = false;

  private height = 512;

  public left = 0;

  private width = 512;

  public url = '';

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'extension-popup',
      bounds: {
        width: 512,
        height: 512,
        y: 30,
      },
      devtools: false,
      webPreferences: {
        webviewTag: true,
      },
    });

    ipcMain.on(`bounds-${this.webContents.id}`, (e, width, height) => {
      this.height = height;
      this.width = width;
      this.rearrange();
    });

    this.webContents.on('will-attach-webview', (e, webPreferences, params) => {
      webPreferences.additionalArguments = ['--session-id=1'];
      webPreferences.sandbox = true;
      webPreferences.nodeIntegration = false;
      webPreferences.contextIsolation = true;
    });
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();

    super.rearrange({
      x: Math.round(Math.min(this.left - this.width + 12, width - this.width)),
      height: Math.round(Math.min(1024, this.height)),
      width: Math.round(Math.min(1024, this.width)),
    });
  }

  public show(inspect = false) {
    super.show();
    this.webContents.send('visible', true, { url: this.url, inspect });
  }
}
