import { VIEW_Y_OFFSET } from '~/constants/design';
import { AppWindow } from '../windows';
import { Dialog } from '.';

const WIDTH = 350;
const HEIGHT = 271;

export class CredentialsDialog extends Dialog {
  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'credentials',
      bounds: {
        height: HEIGHT,
        width: WIDTH,
        y: VIEW_Y_OFFSET,
      },
    });
  }

  public rearrange() {
    const { width } = this.appWindow.win.getContentBounds();
    super.rearrange({
      x: width - WIDTH,
    });
  }
}
