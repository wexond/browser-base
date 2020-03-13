import { ipcMain } from 'electron';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { AppWindow } from '../windows';
import { Dialog } from '.';

const HEIGHT = 165;
const WIDTH = 366;

export class PermissionsDialog extends Dialog {
  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'permissions',
      bounds: {
        height: HEIGHT,
        width: WIDTH,
        y: TOOLBAR_HEIGHT,
        x: 0,
      },
    });
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

      this.show();

      this.webContents.send('request-permission', { name, url, details });

      ipcMain.once(
        `request-permission-result-${this.appWindow.id}`,
        (e, r: boolean) => {
          resolve(r);
          this.hide();
        },
      );
    });
  }
}
