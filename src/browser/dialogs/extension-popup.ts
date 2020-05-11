import { BrowserWindow, app, Menu, ipcMain } from 'electron';
import { Application } from '../application';
import { DIALOG_MARGIN_TOP, DIALOG_MARGIN } from '~/constants/design';
import { resolve } from 'path';

export const showExtensionDialog = (
  browserWindow: BrowserWindow,
  x: number,
  y: number,
  url: string,
  inspect = false,
) => {
  if (!process.env.ENABLE_EXTENSIONS) return;

  let height = 512;
  let width = 512;

  app.on('web-contents-created', (e, wc) => {
    if (wc.getType() === 'webview') {
      if (inspect) {
        wc.openDevTools();
      }

      wc.on('context-menu', (e, params) => {
        const menu = Menu.buildFromTemplate([
          {
            label: 'Inspect element',
            click: () => {
              wc.inspectElement(params.x, params.y);
            },
          },
        ]);

        menu.popup();
      });
    }
  });

  const dialog = Application.instance.dialogs.show({
    name: 'extension-popup',
    browserWindow,
    getBounds: () => {
      return {
        x: x - width + DIALOG_MARGIN,
        y: y - DIALOG_MARGIN_TOP,
        height: Math.min(1024, height),
        width: Math.min(1024, width),
      };
    },
    onWindowBoundsUpdate: () => dialog.hide(),
  });

  if (!dialog) return;

  ipcMain.on('extension-popup-size', (e, w, h) => {
    width = w + 32;
    height = h + 40;
    dialog.rearrange();
    dialog.browserView.webContents.send('webview-size', w, h);
  });

  ipcMain.once('webview-blur', () => {
    dialog.browserView.webContents.send('webview-blur');
  });

  dialog.browserView.webContents.on(
    'will-attach-webview',
    (e, webPreferences, params) => {
      webPreferences.sandbox = true;
      webPreferences.nodeIntegration = false;
      webPreferences.contextIsolation = true;
      webPreferences.enableRemoteModule = false;
      webPreferences.preloadURL = `file:///${resolve(
        app.getAppPath(),
        'build',
        'popup-preload.bundle.js',
      )}`;
    },
  );

  dialog.on('loaded', (e) => {
    e.reply('data', url);
  });
};
