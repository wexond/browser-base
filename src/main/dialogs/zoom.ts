import { AppWindow } from '../windows';
import { Dialog } from '.';
import { DIALOG_MARGIN, DIALOG_MARGIN_TOP } from '~/constants/design';

const WIDTH = 280;

export class ZoomDialog extends Dialog {
  public visible = false;

  public left = 0;
  public top = 0;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'zoom',
      bounds: {
        width: WIDTH,
        height: 100,
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
    this.send('visible', true);
  }
}
