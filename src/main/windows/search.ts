import { AppWindow } from '.';
import { BrowserView, app, ipcMain } from 'electron';
import { join } from 'path';

const WIDTH = 800;
const HEIGHT = 56;

export class SearchWindow extends BrowserView {
  public appWindow: AppWindow;

  public visible = false;

  public constructor(appWindow: AppWindow) {
    super({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.appWindow = appWindow;

    appWindow.addBrowserView(this);

    this.hide();

    ipcMain.on(`hide-${this.webContents.id}`, () => {
      this.hide();
    });

    if (process.env.ENV === 'dev') {
      this.webContents.loadURL(`http://localhost:4444/search.html`);
      this.webContents.openDevTools({ mode: 'detach' });
    } else {
      this.webContents.loadURL(
        join('file://', app.getAppPath(), `build/search.html`),
      );
    }
  }

  public toggle() {
    if (!this.visible) this.show();
    else this.hide();
  }

  public show() {
    const cBounds = this.appWindow.getContentBounds();

    this.setBounds({
      height: HEIGHT,
      width: WIDTH,
      x: Math.round(cBounds.width / 2 - WIDTH / 2),
      y: 48,
    } as any);

    this.appWindow.removeBrowserView(this);
    this.appWindow.addBrowserView(this);

    const selected = this.appWindow.viewManager.selected;

    this.webContents.send('visible', true, {
      id: this.appWindow.viewManager.selectedId,
      url: selected.webContents.getURL(),
    });
    this.webContents.focus();

    this.visible = true;
  }

  public hide() {
    this.setBounds({
      height: HEIGHT,
      width: WIDTH,
      x: 0,
      y: -HEIGHT + 1,
    });

    this.webContents.send('visible', false);

    this.visible = false;
  }
}
