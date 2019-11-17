import { AppWindow } from '../windows';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { Dialog } from '.';

const WIDTH = 200;
const HEIGHT = 200;

export class TabGroupDialog extends Dialog {
  public visible = false;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'tabgroup',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: TOOLBAR_HEIGHT,
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
