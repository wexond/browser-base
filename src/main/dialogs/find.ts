import { AppWindow } from '../windows';
import { DIALOG_MIN_HEIGHT, VIEW_Y_OFFSET } from '~/constants/design';
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
        y: VIEW_Y_OFFSET,
      },
    });

    ipcMain.on(`show-${this.id}`, () => {
      this.show();
    });
  }

  public rearrangePreview(toggle: boolean) {
    super.rearrange({
      height: toggle ? DIALOG_MIN_HEIGHT : HEIGHT,
    });
  }

  public async show() {
    super.show();

    const tabId = this.appWindow.viewManager.selectedId;
    this.tabIds.push(tabId);
    this.send('visible', true, tabId);
  }

  public rearrange() {
    const { width } = this.appWindow.win.getContentBounds();
    super.rearrange({
      x: width - WIDTH,
    });
  }
}
