import { VIEW_Y_OFFSET, DIALOG_MARGIN_TOP } from '~/constants/design';
import { Dialog } from './dialog';
import { AppWindow } from '../windows';

const WIDTH = 208;
const HEIGHT = 128;

export class AutoFillDialog extends Dialog {
  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'auto-fill',
      bounds: {
        height: HEIGHT,
        width: WIDTH,
      },
    });
  }

  public resize(count: number, hasSubtext = false) {
    const itemHeight = hasSubtext ? 56 : 32;
    super.rearrange({
      width: WIDTH,
      height: count * itemHeight + DIALOG_MARGIN_TOP * 2 + 16,
    });
  }

  public showAtPos({ height, x, y }: IAutoFillMenuPosition) {
    this.rearrange({
      x: x - 8,
      y: y + height + VIEW_Y_OFFSET - DIALOG_MARGIN_TOP + 2,
    });

    this.show(false);
  }
}
