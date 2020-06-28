import { ipcMain } from 'electron';
import { Application } from '../application';

export class OmniboxService {
  constructor() {
    ipcMain.on('omnibox-input', (e, data) => {
      const overlay = Application.instance.overlay.fromWebContents(e.sender);
      overlay.win.focus();
      overlay.send('omnibox-input', data);
    });

    ipcMain.on(`omnibox-update-input`, (e, data) => {
      const window = Application.instance.windows.fromWebContents(e.sender);

      window.win.focus();

      window.send('addressbar-update-input', data);
    });
  }
}
