import { ipcMain } from 'electron';
import { AppWindow } from '../windows';
import {
  TOOLBAR_HEIGHT,
  VIEW_Y_OFFSET,
  DIALOG_MARGIN_TOP,
} from '~/constants/design';
import { Dialog } from '.';

const WIDTH = 400;
const HEIGHT = 500;

export class AuthDialog extends Dialog {
  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'auth',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: VIEW_Y_OFFSET - DIALOG_MARGIN_TOP - 8,
      },
    });
  }

  public requestAuth(
    url: string,
    tabId: number,
  ): Promise<{ username: string; password: string }> {
    return new Promise((resolve) => {
      this.show();
      this.tabIds.push(tabId);

      this.send('request-auth', url);

      ipcMain.once(`request-auth-result-${this.appWindow.id}`, (e, result) => {
        this.tabIds = this.tabIds.filter((x) => x !== tabId);
        this.hide();
        resolve(result);
      });
    });
  }

  public rearrange() {
    const { width } = this.appWindow.win.getContentBounds();

    super.rearrange({
      x: Math.round(width / 2 - WIDTH / 2),
      y: TOOLBAR_HEIGHT,
    });
  }
}
