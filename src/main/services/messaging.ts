import { ipcMain } from 'electron';

import { AppWindow } from '../windows';
import { Application } from '../application';
import {
  IAutoFillMenuPosition,
  IAutoFillCredentialsData,
  IAutoFillMenuData,
  IAutoFillMenuItem,
} from '~/interfaces';

export const runMessagingService = (appWindow: AppWindow) => {
  const { id } = appWindow;

  ipcMain.on(`window-focus-${id}`, () => {
    appWindow.win.focus();
    appWindow.webContents.focus();
  });

  ipcMain.on(`window-toggle-maximize-${id}`, () => {
    if (appWindow.win.isMaximized()) {
      appWindow.win.unmaximize();
    } else {
      appWindow.win.maximize();
    }
  });

  ipcMain.on(`window-minimize-${id}`, () => {
    appWindow.win.minimize();
  });

  ipcMain.on(`window-close-${id}`, () => {
    appWindow.win.close();
  });

  ipcMain.on(`window-fix-dragging-${id}`, () => {
    appWindow.fixDragging();
  });

  ipcMain.on(`find-show-${id}`, () => {
    appWindow.dialogs.findDialog.show();
  });

  ipcMain.on(`show-menu-dialog-${id}`, (e, left, top) => {
    appWindow.dialogs.menuDialog.left = left;
    appWindow.dialogs.menuDialog.top = top;
    appWindow.dialogs.menuDialog.show();
  });

  ipcMain.handle(`is-dialog-visible-${id}`, (e, dialog) => {
    return appWindow.dialogs[dialog].visible;
  });

  ipcMain.on(`search-show-${id}`, (e, data) => {
    appWindow.dialogs.searchDialog.data = data;
    appWindow.dialogs.searchDialog.show();
  });

  ipcMain.on(`show-tab-preview-${id}`, (e, tab) => {
    appWindow.dialogs.previewDialog.tab = tab;
    appWindow.dialogs.previewDialog.show();
  });

  ipcMain.on(`hide-tab-preview-${id}`, (e, tab) => {
    appWindow.dialogs.previewDialog.hide(
      appWindow.dialogs.previewDialog.visible,
    );
  });

  ipcMain.on(`show-tabgroup-dialog-${id}`, (e, tabGroup) => {
    appWindow.dialogs.tabGroupDialog.edit(tabGroup);
  });

  ipcMain.on(`show-downloads-dialog-${id}`, (e, left, top) => {
    appWindow.dialogs.downloadsDialog.left = left;
    appWindow.dialogs.downloadsDialog.top = top;
    appWindow.dialogs.downloadsDialog.show();
  });

  ipcMain.on(`show-extension-popup-${id}`, (e, left, top, url, inspect) => {
    appWindow.dialogs.extensionPopup.left = left;
    appWindow.dialogs.extensionPopup.top = top;
    appWindow.dialogs.extensionPopup.url = url;
    appWindow.dialogs.extensionPopup.show(inspect);
  });

  ipcMain.on(`hide-extension-popup-${id}`, e => {
    if (appWindow.dialogs.extensionPopup.visible) {
      appWindow.dialogs.extensionPopup.hideVisually();
    }
  });

  ipcMain.on(`show-add-bookmark-dialog-${id}`, (e, left, top) => {
    appWindow.dialogs.addBookmarkDialog.left = left;
    appWindow.dialogs.addBookmarkDialog.top = top;
    appWindow.dialogs.addBookmarkDialog.show();
  });

  ipcMain.on(`edit-tabgroup-${id}`, (e, tabGroup) => {
    appWindow.send(`edit-tabgroup`, tabGroup);
  });

  ipcMain.on(`is-incognito-${id}`, e => {
    e.returnValue = appWindow.incognito;
  });

  ipcMain.on(
    `credentials-data-${id}`,
    (e, username: string, password: string) => {
      appWindow.dialogs.credentialsDialog.send('data', username, password);
    },
  );

  ipcMain.on(
    `credentials-available-${id}`,
    (e, active: boolean, tabId: number) => {
      appWindow.webContents.send(`credentials-available`, active, tabId);
    },
  );

  ipcMain.on(`credentials-dialog-show-${id}`, () => {
    const dialog = appWindow.dialogs.credentialsDialog;

    dialog.send('show');
    dialog.rearrange();
    dialog.show();
  });

  ipcMain.on(`credentials-dialog-hide-${id}`, () => {
    appWindow.dialogs.credentialsDialog.hide();
  });

  ipcMain.on(`credentials-save-${id}`, (e, data: IAutoFillCredentialsData) => {
    const view = appWindow.viewManager.selected;
    const hostname = view.hostname;
    const favicon = appWindow.viewManager.selected.favicon;

    Application.instance.autoFill.saveCredentials(hostname, data, favicon);
  });

  ipcMain.on(
    `credentials-update-${id}`,
    (e, data: IAutoFillCredentialsData, oldUsername: string) => {
      const view = appWindow.viewManager.selected;
      const hostname = view.hostname;

      Application.instance.autoFill.updateCredentials(
        hostname,
        data,
        oldUsername,
      );
    },
  );

  ipcMain.on(
    `auto-fill-show-${id}`,
    async (
      e,
      pos: IAutoFillMenuPosition,
      name: string,
      value: string,
      credentials: boolean,
    ) => {
      const view = appWindow.viewManager.selected;
      const hostname = view.hostname;
      const autoFill = Application.instance.autoFill;

      const items = await (credentials
        ? autoFill.getMenuCredentialsItems(hostname, name, value)
        : autoFill.getMenuAddressItems(hostname, name, value));

      if (items.length) {
        const data: IAutoFillMenuData = {
          items,
          type: credentials ? 'password' : 'address',
        };

        appWindow.dialogs.autoFillDialog.send(`auto-fill-menu-data`, data);

        appWindow.dialogs.autoFillDialog.resize(
          items.length,
          items.find(r => r.sublabel) != null,
        );

        appWindow.dialogs.autoFillDialog.showAtPos(pos);
      }
    },
  );

  ipcMain.on(`auto-fill-hide-${id}`, () => {
    appWindow.dialogs.autoFillDialog.hide();
  });

  ipcMain.on(`auto-fill-inject-${id}`, async (e, _id: string) => {
    const view = appWindow.viewManager.selected;

    console.log('XDDDDDDDDDDDDDDDDDDD', _id);
    const data = await Application.instance.autoFill.getCredentialsById(_id);

    view.webContents.send(`credentials-inject`, data);
  });
};
