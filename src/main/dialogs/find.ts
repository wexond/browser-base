import { AppWindow } from '../windows';
import { TOOLBAR_HEIGHT, DIALOG_MIN_HEIGHT } from '~/constants/design';
import { Dialog } from '.';
import { ipcMain } from 'electron';

const WIDTH = 416;
const HEIGHT = 70;

export class FindDialog extends Dialog {
  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'find',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: TOOLBAR_HEIGHT + 8,
      },
    });

    ipcMain.on(`show-${this.webContents.id}`, () => {
      this.show();
    });
  }

  public rearrangePreview(toggle: boolean) {
    super.rearrange({
      height: toggle ? DIALOG_MIN_HEIGHT : HEIGHT,
    });
  }

  public find(tabId: number, data: any) {
    data.visible = true;
    this.show();
    this.updateInfo(tabId, data);
  }

  public updateInfo(tabId: number, data: any) {
    this.tabId = tabId;
    this.webContents.send('update-info', tabId, data);
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();
    super.rearrange({
      x: width - WIDTH,
    });
  }
}
