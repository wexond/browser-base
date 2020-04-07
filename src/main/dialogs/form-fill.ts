import { VIEW_Y_OFFSET, DIALOG_MARGIN_TOP } from '~/constants/design';
import { Dialog } from './dialog';
import { AppWindow } from '../windows';

const WIDTH = 208;
const HEIGHT = 128;

export class FormFillDialog extends Dialog {
  public inputRect = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };

  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'form-fill',
      bounds: {
        height: HEIGHT,
        width: WIDTH,
      },
    });
  }

  public rearrange() {
    super.rearrange({
      x: this.inputRect.x - 8,
      y:
        this.inputRect.y +
        this.inputRect.height +
        VIEW_Y_OFFSET -
        DIALOG_MARGIN_TOP +
        2,
    });
  }

  public resize(count: number, hasSubtext = false) {
    const itemHeight = hasSubtext ? 56 : 32;
    super.rearrange({
      width: WIDTH,
      height: count * itemHeight + DIALOG_MARGIN_TOP * 2 + 16,
    });
  }
}
