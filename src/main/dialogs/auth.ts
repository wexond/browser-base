import { ipcMain } from 'electron';
import { AppWindow } from '../windows';
import { TOOLBAR_HEIGHT } from '~/constants/design';
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
        y: TOOLBAR_HEIGHT,
      },
    });
  }

  public requestAuth(
    url: string,
    tabId: number,
  ): Promise<{ username: string; password: string }> {
    return new Promise(resolve => {
      this.show();
      this.tabId = tabId;

      this.webContents.send('request-auth', url);

      ipcMain.once(`request-auth-result-${this.appWindow.id}`, (e, result) => {
        this.tabId = -1;
        this.hide();
        resolve(result);
      });
    });
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();

    super.rearrange({
      x: Math.round(width / 2 - WIDTH / 2),
      y: TOOLBAR_HEIGHT,
    });
  }
}
