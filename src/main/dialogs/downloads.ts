import { AppWindow } from '../windows';
import { Dialog } from '.';

const WIDTH = 400;
const HEIGHT = 550;

export class DownloadsDialog extends Dialog {
  public visible = false;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'downloads',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: 36,
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
}
