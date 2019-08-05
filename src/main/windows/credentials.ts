import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants/design';
import { AppWindow } from '.';
import { PopupWindow } from './popup';

const WIDTH = 350;
const HEIGHT = 271;

export class CredentialsWindow extends PopupWindow {
  public constructor(appWindow: AppWindow) {
    super(appWindow, 'credentials', true);

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
