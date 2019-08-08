import { AppWindow } from '.';
import { BrowserView, app } from 'electron';
import { join } from 'path';

const WIDTH = 350;
const HEIGHT = 700;

export class MenuWindow extends BrowserView {
  public constructor(appWindow: AppWindow) {
    super({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    setImmediate(() => {
      const cBounds = appWindow.getContentBounds();

      this.setBounds({
        height: HEIGHT,
        width: WIDTH,
        x: cBounds.width - WIDTH,
        y: 32,
      } as any);
    });

    this.setAutoResize({ horizontal: true, vertical: true } as any);

    if (process.env.ENV === 'dev') {
      this.webContents.loadURL(`http://localhost:4444/menu.html`);
    } else {
      this.webContents.loadURL(
        join('file://', app.getAppPath(), `build/menu.html`),
      );
    }

    this.webContents.openDevTools({ mode: 'detach' });
  }
}
