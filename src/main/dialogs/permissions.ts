import { ipcMain } from 'electron';
import { VIEW_Y_OFFSET } from '~/constants/design';
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
        y: VIEW_Y_OFFSET,
        x: 0,
      },
    });
  }

  public async requestPermission(
    name: string,
    url: string,
    details: any,
    tabId: number,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (
        name === 'unknown' ||
        (name === 'media' && details.mediaTypes.length === 0) ||
        name === 'midiSysex'
      ) {
        return reject('Unknown permission');
      }

      this.tabIds.push(tabId);

      this.show();

      this.send('request-permission', { name, url, details });

      ipcMain.once(
        `request-permission-result-${this.appWindow.id}`,
        (e, r: boolean) => {
          resolve(r);
          this.tabIds = this.tabIds.filter((x) => x !== tabId);
          this.hide();
        },
      );
    });
  }
}
