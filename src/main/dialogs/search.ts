import { AppWindow } from '../windows';
import { ipcMain } from 'electron';
import { Dialog } from '.';

const WIDTH = 800;
const HEIGHT = 56;

export class SearchDialog extends Dialog {
  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'search',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: 48,
      },
      hideTimeout: 300,
    });

    ipcMain.on(`height-${this.webContents.id}`, (e, height) => {
      const { width } = this.appWindow.getContentBounds();
      this.rearrange({
        height: HEIGHT + height,
        x: Math.round(width / 2 - WIDTH / 2),
      });
    });
  }

  public toggle() {
    if (!this.visible) this.show();
    else this.hide();
  }

  public show() {
    const { width } = this.appWindow.getContentBounds();

    super.show({
      x: Math.round(width / 2 - WIDTH / 2),
    });

    const selected = this.appWindow.viewManager.selected;

    this.webContents.send('visible', true, {
      id: this.appWindow.viewManager.selectedId,
      url: selected.webContents.getURL(),
    });

    this.appWindow.webContents.send('get-search-tabs');

    ipcMain.once('get-search-tabs', (e, tabs) => {
      this.webContents.send('search-tabs', tabs);
    });
  }

  public hide() {
    super.hide();
    this.webContents.send('visible', false);
  }
}
