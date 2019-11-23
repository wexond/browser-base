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

  ipcMain.on(`update-tab-find-info-${id}`, (e, ...args) =>
    appWindow.webContents.send('update-tab-find-info', ...args),
  );

  ipcMain.on(`update-find-info-${id}`, (e, tabId, data) => {
    if (appWindow.findDialog.visible) {
      appWindow.findDialog.updateInfo(tabId, data);
    }
  });

  ipcMain.on(`find-show-${id}`, (e, tabId, data) => {
    appWindow.findDialog.find(tabId, data);
  });

  ipcMain.on(`menu-show-${id}`, e => {
    appWindow.menuDialog.toggle();
  });

  ipcMain.on(`search-show-${id}`, e => {
    appWindow.searchDialog.toggle();
  });

  ipcMain.on(`show-tab-preview-${id}`, (e, tab) => {
    appWindow.previewDialog.tab = tab;
    appWindow.previewDialog.show();
  });

  ipcMain.on(`hide-tab-preview-${id}`, (e, tab) => {
    appWindow.previewDialog.hide(appWindow.previewDialog.visible);
  });

  ipcMain.on(`show-tabgroup-dialog-${id}`, (e, tabGroup) => {
    appWindow.tabGroupDialog.edit(tabGroup);
  });

  ipcMain.on(`show-downloads-dialog-${id}`, (e, left) => {
    appWindow.downloadsDialog.left = left;
    appWindow.downloadsDialog.show();
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
      appWindow.formFillDialog.webContents.send(`formfill-get-items`, items);
      appWindow.formFillDialog.inputRect = rect;

      appWindow.formFillDialog.resize(
        items.length,
        items.find(r => r.subtext) != null,
      );
      appWindow.formFillDialog.rearrange();
      appWindow.formFillDialog.show(false);
    } else {
      appWindow.formFillDialog.hide();
    }
  });

  ipcMain.on(`form-fill-hide-${id}`, () => {
    appWindow.formFillDialog.hide();
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
    appWindow.credentialsDialog.webContents.send('credentials-update', data);
    appWindow.credentialsDialog.rearrange();
    appWindow.credentialsDialog.show();
  });

  ipcMain.on(`credentials-hide-${id}`, () => {
    appWindow.credentialsDialog.hide();
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
