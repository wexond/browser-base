import { AppWindow } from '../windows';
import { MENU_WIDTH, DIALOG_MARGIN, DIALOG_TOP } from '~/constants/design';
import { Dialog } from '.';

const WIDTH = MENU_WIDTH;
const HEIGHT = 550;

export class MenuDialog extends Dialog {
  public visible = false;
  public left = 0;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'menu',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: DIALOG_TOP,
      },
      devtools: false,
    });
  }

  public rearrange() {
    super.rearrange({ x: this.left - WIDTH + DIALOG_MARGIN });
  }

  public async show() {
    await super.show();
    this.webContents.send('visible', true);
  }
}
