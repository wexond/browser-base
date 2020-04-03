import { AppWindow } from '../windows';
import { Dialog } from '.';
import { ipcMain } from 'electron';
import { DIALOG_MARGIN, DIALOG_MARGIN_TOP } from '~/constants/design';

export class ExtensionPopup extends Dialog {
  public visible = false;

  private height = 512;

  public left = 0;
  public top = 0;

  private width = 512;

  public url = '';

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'extension-popup',
      bounds: {
        width: 512,
        height: 512,
      },
      devtools: false,
      webPreferences: {
        webviewTag: true,
      },
    });

    ipcMain.on(`bounds-${this.id}`, (e, width, height) => {
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
    super.rearrange({
      x: Math.round(this.left - this.width + DIALOG_MARGIN),
      y: Math.round(this.top - DIALOG_MARGIN_TOP),
      height: Math.round(Math.min(1024, this.height)),
      width: Math.round(Math.min(1024, this.width)),
    });
  }

  public async show(inspect = false) {
    await super.show();
    this.send('visible', true, { url: this.url, inspect });
  }
}
