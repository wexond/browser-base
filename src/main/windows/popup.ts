import { BrowserWindow, app, ipcMain } from 'electron';
import { join } from 'path';
import { AppWindow } from '.';

export class PopupWindow extends BrowserWindow {
  constructor(public appWindow: AppWindow, name: string, devtools = false) {
    super({
      frame: false,
      resizable: false,
      transparent: true,
      show: false,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      skipTaskbar: true,
    });

    if (process.env.ENV === 'dev') {
      if (devtools) {
        this.webContents.openDevTools({ mode: 'detach' });
      }
      this.loadURL(`http://localhost:4444/${name}.html`);
    } else {
      this.loadURL(join('file://', app.getAppPath(), `build/${name}.html`));
    }

    ipcMain.on(`get-window-id-${this.id}`, e => {
      e.returnValue = this.appWindow.webContents.id;
    });

    this.setParentWindow(this.appWindow);
  }
}
