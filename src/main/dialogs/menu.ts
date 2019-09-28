import { AppWindow } from '../windows';
import { MENU_WIDTH } from '~/constants/design';
import { Dialog } from '.';

const WIDTH = MENU_WIDTH;
const HEIGHT = 550;

export class MenuDialog extends Dialog {
  public visible = false;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'menu',
      bounds: {
        width: MENU_WIDTH,
        height: HEIGHT,
        y: 32,
      },
    });
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();
    super.rearrange({ x: width - WIDTH });
  }

  public show() {
    super.show();
    this.webContents.send('visible', true);
  }

  public hide() {
    super.hide();
    this.webContents.send('visible', false);
  }
}
