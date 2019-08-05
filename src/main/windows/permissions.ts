import { ipcMain } from 'electron';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants/design';
import { AppWindow } from '.';
import { PopupWindow } from './popup';

const HEIGHT = 175;
const WIDTH = 350;

export class PermissionsWindow extends PopupWindow {
  public constructor(appWindow: AppWindow) {
    super(appWindow, 'permissions');

    this.setBounds({
      height: HEIGHT,
      width: WIDTH,
    } as any);
  }

  public async requestPermission(
    name: string,
    url: string,
    details: any,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (
        name === 'unknown' ||
        (name === 'media' && details.mediaTypes.length === 0) ||
        name === 'midiSysex'
      ) {
        return reject('Unknown permission');
      }

      this.rearrange();
      this.show();

      this.webContents.send('request-permission', { name, url, details });

      ipcMain.once(
        `request-permission-result-${this.appWindow.webContents.id}`,
        (e, r: boolean) => {
          resolve(r);
          this.hide();
        },
      );
    });
  }

  public rearrange() {
    const cBounds = this.appWindow.getContentBounds();
    this.setBounds({ x: cBounds.x, y: cBounds.y + TOOLBAR_HEIGHT } as any);
  }
}
