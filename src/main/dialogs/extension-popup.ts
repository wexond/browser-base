import { AppWindow } from '../windows';
import { Dialog } from '.';
import { ipcMain } from 'electron';

const WIDTH = 350;

export class ExtensionPopup extends Dialog {
  public visible = false;

  private height = 512;

  public left = 0;

  public url = '';

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'extension-popup',
      bounds: {
        width: WIDTH,
        height: 512,
        y: 34,
      },
      devtools: true,
      webPreferences: {
        webviewTag: true,
      },
    });

    ipcMain.on(`height-${this.webContents.id}`, (e, height) => {
      this.height = height;
      this.rearrange();
    });

    this.webContents.on('will-attach-webview', (e, webPreferences, params) => {
      webPreferences.additionalArguments = ['--session-id=1'];
    });
  }

  public rearrange() {
    const { width, height } = this.appWindow.getContentBounds();

    const maxHeight = height - 34 - 16;

    super.rearrange({
      x: Math.round(Math.min(this.left - WIDTH / 2, width - WIDTH)),
      height: Math.round(Math.min(height, this.height + 16)),
    });

    this.webContents.send(`max-height`, Math.min(maxHeight, this.height));
  }

  public show() {
    super.show();
    this.webContents.send('visible', true, { url: this.url });
  }
}
