import { ipcMain, BrowserWindow } from 'electron';
import {
  DIALOG_MIN_HEIGHT,
  DIALOG_MARGIN_TOP,
  TITLEBAR_HEIGHT,
  DIALOG_MARGIN,
} from '~/constants/design';
import { PersistentDialog } from './dialog';
import { Application } from '../application';

const WIDTH = 800;
const HEIGHT = 80;

export class SearchDialog extends PersistentDialog {
  private isPreviewVisible = false;

  public data = {
    text: '',
    x: 0,
    width: 200,
  };

  public constructor() {
    super({
      name: 'search',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: 48,
      },

      devtools: false,
    });

    ipcMain.on(`height-${this.id}`, (e, height) => {
      super.rearrange({
        height: this.isPreviewVisible
          ? Math.max(DIALOG_MIN_HEIGHT, HEIGHT + height)
          : HEIGHT + height,
      });
    });

    ipcMain.on(`addressbar-update-input-${this.id}`, (e, data) => {
      this.browserWindow.webContents.send('addressbar-update-input', data);
    });
  }

  public rearrange() {
    super.rearrange({
      x: Math.round(this.data.x - DIALOG_MARGIN),
      y: TITLEBAR_HEIGHT - DIALOG_MARGIN_TOP,
      width: Math.round(this.data.width + 2 * DIALOG_MARGIN),
    });
  }

  public async show(browserWindow: BrowserWindow) {
    super.show(browserWindow, true, false);

    this.send('visible', true, {
      id: Application.instance.windows.current.viewManager.selectedId,
      ...this.data,
    });

    ipcMain.once('get-search-tabs', (e, tabs) => {
      this.send('search-tabs', tabs);
    });

    browserWindow.webContents.send('get-search-tabs');
  }

  public hide(bringToTop = false) {
    super.hide(bringToTop);
  }
}
