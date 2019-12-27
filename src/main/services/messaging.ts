import { ipcMain } from 'electron';
import { parse } from 'url';
import { setPassword, deletePassword, getPassword } from 'keytar';

import { IFormFillData } from '~/interfaces';
import { AppWindow } from '../windows';
import { getFormFillMenuItems } from '../utils';
import storage from './storage';

export const runMessagingService = (appWindow: AppWindow) => {
  const { id } = appWindow;

  ipcMain.on(`window-focus-${id}`, () => {
    appWindow.focus();
    appWindow.webContents.focus();
  });

  ipcMain.on(`window-toggle-maximize-${id}`, () => {
    if (appWindow.isMaximized()) {
      appWindow.unmaximize();
    } else {
      appWindow.maximize();
    }
  });

  ipcMain.on(`window-minimize-${id}`, () => {
    appWindow.minimize();
  });

  ipcMain.on(`window-close-${id}`, () => {
    appWindow.close();
  });

  ipcMain.on(`window-fix-dragging-${id}`, () => {
    appWindow.fixDragging();
  });

  ipcMain.on(`update-tab-find-info-${id}`, (e, ...args) =>
    appWindow.webContents.send('update-tab-find-info', ...args),
  );

  ipcMain.on(`update-find-info-${id}`, (e, tabId, data) => {
    if (appWindow.dialogs.findDialog.visible) {
      appWindow.dialogs.findDialog.updateInfo(tabId, data);
    }
  });

  ipcMain.on(`find-show-${id}`, (e, tabId, data) => {
    appWindow.dialogs.findDialog.find(tabId, data);
  });

  ipcMain.on(`menu-show-${id}`, e => {
    appWindow.dialogs.menuDialog.toggle();
  });

  ipcMain.on(`search-show-${id}`, e => {
    appWindow.dialogs.searchDialog.toggle();
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

  ipcMain.on(`show-downloads-dialog-${id}`, (e, left) => {
    appWindow.dialogs.downloadsDialog.left = left;
    appWindow.dialogs.downloadsDialog.show();
  });

  ipcMain.on(`show-extension-popup-${id}`, (e, left, url) => {
    appWindow.dialogs.extensionPopup.left = left;
    appWindow.dialogs.extensionPopup.url = url;
    appWindow.dialogs.extensionPopup.show();
  });

  ipcMain.on(`show-add-bookmark-dialog-${id}`, (e, left) => {
    appWindow.dialogs.addBookmarkDialog.left = left;
    appWindow.dialogs.addBookmarkDialog.show();
  });

  ipcMain.on(`edit-tabgroup-${id}`, (e, tabGroup) => {
    appWindow.webContents.send(`edit-tabgroup`, tabGroup);
  });

  ipcMain.on(`is-incognito-${id}`, e => {
    e.returnValue = appWindow.incognito;
  });

  ipcMain.on(`form-fill-show-${id}`, async (e, rect, name, value) => {
    const items = await getFormFillMenuItems(name, value);

    if (items.length) {
      appWindow.dialogs.formFillDialog.webContents.send(
        `formfill-get-items`,
        items,
      );
      appWindow.dialogs.formFillDialog.inputRect = rect;

      appWindow.dialogs.formFillDialog.resize(
        items.length,
        items.find(r => r.subtext) != null,
      );
      appWindow.dialogs.formFillDialog.rearrange();
      appWindow.dialogs.formFillDialog.show(false);
    } else {
      appWindow.dialogs.formFillDialog.hide();
    }
  });

  ipcMain.on(`form-fill-hide-${id}`, () => {
    appWindow.dialogs.formFillDialog.hide();
  });

  ipcMain.on(
    `form-fill-update-${id}`,
    async (e, _id: string, persistent = false) => {
      const url = appWindow.viewManager.selected.webContents.getURL();
      const { hostname } = parse(url);

      const item =
        _id &&
        (await storage.findOne<IFormFillData>({
          scope: 'formfill',
          query: { _id },
        }));

      if (item && item.type === 'password') {
        item.fields.password = await getPassword(
          'wexond',
          `${hostname}-${item.fields.username}`,
        );
      }

      appWindow.viewManager.selected.webContents.send(
        `form-fill-update-${id}`,
        item,
        persistent,
      );
    },
  );

  ipcMain.on(`credentials-show-${id}`, (e, data) => {
    appWindow.dialogs.credentialsDialog.webContents.send(
      'credentials-update',
      data,
    );
    appWindow.dialogs.credentialsDialog.rearrange();
    appWindow.dialogs.credentialsDialog.show();
  });

  ipcMain.on(`credentials-hide-${id}`, () => {
    appWindow.dialogs.credentialsDialog.hide();
  });

  ipcMain.on(`credentials-save-${id}`, async (e, data) => {
    const { username, password, update, oldUsername } = data;
    const view = appWindow.viewManager.selected;
    const hostname = view.hostname;

    if (!update) {
      const item = await storage.insert<IFormFillData>({
        scope: 'formfill',
        item: {
          type: 'password',
          url: hostname,
          favicon: appWindow.viewManager.selected.favicon,
          fields: {
            username,
            passLength: password.length,
          },
        },
      });

      appWindow.viewManager.settingsView.webContents.send(
        'credentials-insert',
        item,
      );
    } else {
      await storage.update({
        scope: 'formfill',
        query: {
          type: 'password',
          url: hostname,
          'fields.username': oldUsername,
          'fields.passLength': password.length,
        },
        value: {
          'fields.username': username,
        },
      });

      appWindow.viewManager.settingsView.webContents.send(
        'credentials-update',
        { ...data, hostname },
      );
    }

    await setPassword('wexond', `${hostname}-${username}`, password);

    appWindow.webContents.send(`has-credentials-${view.webContents.id}`, true);
  });

  ipcMain.on(`credentials-remove-${id}`, async (e, data: IFormFillData) => {
    const { _id, fields } = data;
    const view = appWindow.viewManager.selected;

    await storage.remove({
      scope: 'formfill',
      query: {
        _id,
      },
    });

    await deletePassword('wexond', `${view.hostname}-${fields.username}`);

    appWindow.viewManager.settingsView.webContents.send(
      'credentials-remove',
      _id,
    );
  });

  ipcMain.on(
    'credentials-get-password',
    async (e, id: string, account: string) => {
      const password = await getPassword('wexond', account);
      e.sender.send(id, password);
    },
  );
};
