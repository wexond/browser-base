import { TOOLBAR_HEIGHT } from '~/constants/design';
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
        y: TOOLBAR_HEIGHT,
      },
    });
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();
    super.rearrange({
      x: width - WIDTH,
    });
  }
}
