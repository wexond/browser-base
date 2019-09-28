import { AppWindow } from '../windows';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { Dialog } from '.';
import { ipcMain } from 'electron';

const WIDTH = 400;
const HEIGHT = 64;

export class FindDialog extends Dialog {
  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'find',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: TOOLBAR_HEIGHT,
      },
      devtools: true,
    });

    ipcMain.on(`show-${this.webContents.id}`, () => {
      this.show();
    });
  }

  public show() {
    const { width } = this.appWindow.getContentBounds();
    super.show({ x: width - WIDTH });
  }

  public find(tabId: number, data: any) {
    data.visible = true;
    this.show();
    this.updateInfo(tabId, data);
  }

  public updateInfo(tabId: number, data: any) {
    this.webContents.send('update-info', tabId, data);
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();
    super.rearrange({
      x: width - WIDTH,
    });
  }
}
