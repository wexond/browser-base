import { AppWindow } from '../windows';
import {
  MENU_WIDTH,
  DIALOG_MARGIN,
  DIALOG_MARGIN_TOP,
} from '~/constants/design';
import { Dialog } from '.';

const WIDTH = MENU_WIDTH;
const HEIGHT = 550;

export class MenuDialog extends Dialog {
  public visible = false;
  public left = 0;
  public top = 0;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'menu',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
      },
      devtools: false,
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
    this.webContents.send('visible', true);
  }
}
