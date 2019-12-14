import { AppWindow } from '../windows';
import { Dialog } from '.';
import { windowsManager } from '..';

const WIDTH = 350;

export class AddBookmarkDialog extends Dialog {
  public visible = false;

  public left = 0;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'add-bookmark',
      bounds: {
        width: WIDTH,
        height: 228,
        y: 34,
      },
    });
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();

    super.rearrange({
      x: Math.round(Math.min(this.left - WIDTH / 2, width - WIDTH)),
    });
  }

  public show() {
    super.show();
    const view = windowsManager.currentWindow.viewManager.selected;

    this.webContents.send('visible', true, {
      url: view.webContents.getURL(),
      title: view.webContents.getTitle(),
      bookmark: view.bookmark,
    });
  }
}
