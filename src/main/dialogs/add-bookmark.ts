import { AppWindow } from '../windows';
import { Dialog } from '.';
import { windowsManager } from '..';
import { DIALOG_MARGIN, DIALOG_MARGIN_TOP } from '~/constants/design';

const WIDTH = 366;

export class AddBookmarkDialog extends Dialog {
  public visible = false;

  public left = 0;
  public top = 0;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'add-bookmark',
      bounds: {
        width: WIDTH,
        height: 240,
      },
    });
  }

  public rearrange() {
    super.rearrange({
      x: Math.round(this.left - WIDTH + DIALOG_MARGIN),
      y: Math.round(this.top - DIALOG_MARGIN_TOP),
    });
  }

  public async show() {
    await super.show();
    const view = windowsManager.currentWindow.viewManager.selected;

    this.webContents.send('visible', true, {
      url: view.webContents.getURL(),
      title: view.webContents.getTitle(),
      bookmark: view.bookmark,
      favicon: view.favicon,
    });
  }
}
