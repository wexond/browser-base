import { VIEW_Y_OFFSET } from '~/constants/design';
import { BrowserWindow } from 'electron';
import { Application } from '../application';

export const requestPermission = (
  browserWindow: BrowserWindow,
  name: string,
  url: string,
  details: any,
  tabId: number,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (
      name === 'unknown' ||
      (name === 'media' && details.mediaTypes.length === 0) ||
      name === 'midiSysex'
    ) {
      return reject('Unknown permission');
    }

    const appWindow = Application.instance.windows.fromBrowserWindow(
      browserWindow,
    );

    appWindow.viewManager.selected.requestedPermission = { name, url, details };

    const dialog = Application.instance.dialogs.show({
      name: 'permissions',
      browserWindow,
      getBounds: () => ({
        width: 366,
        height: 165,
        x: 0,
        y: VIEW_Y_OFFSET,
      }),
      tabAssociation: {
        tabId,
        getTabInfo: (tabId) => {
          const tab = appWindow.viewManager.views.get(tabId);
          return tab.requestedPermission;
        },
      },
      onWindowBoundsUpdate: (disposition) => {
        if (disposition === 'resize') dialog.rearrange();
      },
    });

    if (!dialog) return;

    dialog.on('result', (e, result) => {
      resolve(result);
      dialog.hide();
    });
  });
};
