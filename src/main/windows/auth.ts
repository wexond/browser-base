import { ipcMain } from 'electron';
import { AppWindow } from '.';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants/design';
import { PopupWindow } from './popup';

const WIDTH = 400;
const HEIGHT = 500;

export class AuthWindow extends PopupWindow {
  constructor(public appWindow: AppWindow) {
    super(appWindow, 'auth');

    this.setBounds({
      height: HEIGHT,
      width: WIDTH,
    } as any);
  }

  public requestAuth(
    url: string,
  ): Promise<{ username: string; password: string }> {
    return new Promise(resolve => {
      this.rearrange();
      this.show();

      this.webContents.send('request-auth', url);

      ipcMain.once(
        `request-auth-result-${this.appWindow.webContents.id}`,
        (e: any, result: any) => {
          this.hide();

          resolve(result);
        },
      );
    });
  }

  public rearrange() {
    const cBounds = this.appWindow.getContentBounds();
    this.setBounds({
      x: Math.round(cBounds.x + cBounds.width / 2 - WIDTH / 2),
      y: cBounds.y + TOOLBAR_HEIGHT,
    } as any);
  }
}
