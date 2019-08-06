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

  ipcMain.on(`update-tab-find-info-${id}`, (e, ...args) =>
    appWindow.webContents.send('update-tab-find-info', ...args),
  );

  ipcMain.on(`find-show-${id}`, (e, tabId, data) => {
    appWindow.findWindow.find(tabId, data);
  });

  ipcMain.on(`permission-dialog-hide-${id}`, () => {
    appWindow.permissionWindow.hide();
  });

  ipcMain.on(`update-find-info-${id}`, (e, tabId, data) =>
    appWindow.findWindow.updateInfo(tabId, data),
  );

  ipcMain.on(`is-incognito-${id}`, e => {
    e.returnValue = appWindow.incognito;
  });

  ipcMain.on(`form-fill-show-${id}`, async (e, rect, name, value) => {
    let items = await getFormFillMenuItems(name, value);

    if (items.length) {
      appWindow.formFillWindow.webContents.send(`formfill-get-items`, items);
      appWindow.formFillWindow.inputRect = rect;

      appWindow.formFillWindow.resize(
        items.length,
        items.find(r => r.subtext) != null,
      );
      appWindow.formFillWindow.rearrange();
      appWindow.formFillWindow.showInactive();
    } else {
      appWindow.formFillWindow.hide();
    }
  });

  ipcMain.on(`form-fill-hide-${id}`, () => {
    appWindow.formFillWindow.hide();
  });

  ipcMain.on(
    `form-fill-update-${id}`,
    async (e, _id: string, persistent = false) => {
      const url = appWindow.viewManager.selected.webContents.getURL();
      const { hostname } = parse(url);

      let item = _id && (
        await storage.findOne<IFormFillData>({
          scope: 'formfill',
          query: { _id },
        }));

      if (item && item.type === 'password') {
        item.fields.password = await getPassword('wexond', `${hostname}-${item.fields.username}`);
      }

      appWindow.viewManager.selected.webContents.send(
        `form-fill-update-${id}`,
        item,
        persistent,
      );
    },
  );

  ipcMain.on(`credentials-show-${id}`, (e, data) => {
    appWindow.credentialsWindow.webContents.send('credentials-update', data);
    appWindow.credentialsWindow.rearrange();
    appWindow.credentialsWindow.show();
  });

  ipcMain.on(`credentials-hide-${id}`, () => {
    appWindow.credentialsWindow.hide();
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
          fields: {
            username,
            passLength: password.length,
          },
        },
      });

      appWindow.webContents.send('credentials-insert', item);
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

      appWindow.webContents.send('credentials-update', { ...data, hostname });
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
    appWindow.webContents.send('credentials-remove', _id);
  });
};
