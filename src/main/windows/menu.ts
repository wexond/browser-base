import { AppWindow } from '.';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants/design';
import { PopupWindow } from './popup';

const WIDTH = 500;
const HEIGHT = 500;

export class MenuWindow extends PopupWindow {
  public constructor(appWindow: AppWindow) {
    super(appWindow, 'menu');

    this.setBounds({
      height: HEIGHT,
      width: WIDTH,
    } as any);
  }

  public rearrange() {
    const cBounds = this.appWindow.getContentBounds();
    this.setBounds({
      x: Math.round(cBounds.x + cBounds.width - WIDTH),
      y: cBounds.y + TOOLBAR_HEIGHT,
    } as any);
  }
}
