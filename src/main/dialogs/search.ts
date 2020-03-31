import { AppWindow } from '../windows';
import { ipcMain } from 'electron';
import { Dialog } from '.';
import {
  DIALOG_MIN_HEIGHT,
  DIALOG_MARGIN_TOP,
  TITLEBAR_HEIGHT,
  DIALOG_MARGIN,
} from '~/constants/design';

const WIDTH = 800;
const HEIGHT = 80;

export class SearchDialog extends Dialog {
  private queueShow = false;

  private lastHeight = 0;
  private isPreviewVisible = false;

  public data = {
    text: '',
    x: 0,
    width: 200,
  };

  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'search',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: 48,
      },

      devtools: false,
    });

    ipcMain.on(`height-${this.webContents.id}`, (e, height) => {
      super.rearrange({
        height: this.isPreviewVisible
          ? Math.max(DIALOG_MIN_HEIGHT, HEIGHT + height)
          : HEIGHT + height,
      });

      this.lastHeight = HEIGHT + height;
    });

    ipcMain.on(`addressbar-update-input-${this.webContents.id}`, (e, data) => {
      this.appWindow.webContents.send('addressbar-update-input', data);
    });

    ipcMain.on(`can-show-${this.webContents.id}`, () => {
      if (this.queueShow) this.show();
    });
  }

  public toggle() {
    if (!this.visible) this.show();
    else this.hide();
  }

  public rearrange() {
    super.rearrange({
      x: Math.round(this.data.x - DIALOG_MARGIN),
      y: TITLEBAR_HEIGHT - DIALOG_MARGIN_TOP,
      width: Math.round(this.data.width + 2 * DIALOG_MARGIN),
    });
  }

  public rearrangePreview(toggle: boolean) {
    this.isPreviewVisible = toggle;
    super.rearrange({
      height: toggle
        ? Math.max(DIALOG_MIN_HEIGHT, this.bounds.height)
        : this.lastHeight,
    });
  }

  public async show() {
    if (this.appWindow.dialogs.previewDialog.visible) {
      this.appWindow.dialogs.previewDialog.hide(true);
    }

    super.show(true, false);

    this.queueShow = true;

    this.webContents.send('visible', true, {
      id: this.appWindow.viewManager.selectedId,
      ...this.data,
    });

    ipcMain.once('get-search-tabs', (e, tabs) => {
      this.webContents.send('search-tabs', tabs);
    });

    this.appWindow.webContents.send('get-search-tabs');
  }

  public hide(bringToTop = false) {
    super.hide(bringToTop);
    this.queueShow = false;
  }
}
