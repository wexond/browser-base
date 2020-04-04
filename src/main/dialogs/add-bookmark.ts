import { AppWindow } from '../windows';
import { Dialog } from '.';
import { DIALOG_MARGIN, DIALOG_TOP } from '~/constants/design';
import { Application } from '../application';

const WIDTH = 366;

export class AddBookmarkDialog extends Dialog {
  public visible = false;

  public left = 0;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'add-bookmark',
      bounds: {
        width: WIDTH,
        height: 240,
        y: DIALOG_TOP,
      },
    });
  }

  public rearrange() {
    super.rearrange({
      x: Math.round(this.left - WIDTH + DIALOG_MARGIN),
    });
  }

  public async show() {
    await super.show();
    const {
      url,
      title,
      bookmark,
      favicon,
    } = Application.instance.windows.current.viewManager.selected;

    this.send('visible', true, {
      url,
      title,
      bookmark,
      favicon,
    });
  }
}
