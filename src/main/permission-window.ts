import { BrowserWindow } from 'electron';

export class PermissionWindow extends BrowserWindow {
  constructor() {
    super({
      frame: false,
      resizable: false,
      width: 900,
      height: 700,
      transparent: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      skipTaskbar: true,
    });
  }
}
