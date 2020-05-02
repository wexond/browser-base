import { ipcMain } from 'electron';
import { AppWindow } from '../windows';
import { Application } from '../application';
import { showMenuDialog } from '../dialogs/menu';
import { PreviewDialog } from '../dialogs/preview';
import { parse } from 'url';
import { IFormFillData, IBookmark } from '~/interfaces';
import { SearchDialog } from '../dialogs/search';

import * as bookmarkMenu from '../menus/bookmarks';
import { showFindDialog } from '../dialogs/find';

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

  ipcMain.on(`show-menu-dialog-${id}`, (e, x, y) => {
    showMenuDialog(appWindow.win, x, y);
  });

  ipcMain.on(`search-show-${id}`, (e, data) => {
    const dialog = Application.instance.dialogs.getPersistent(
      'search',
    ) as SearchDialog;
    dialog.data = data;
    dialog.show(appWindow.win);
  });

  ipcMain.handle(`is-dialog-visible-${id}`, (e, dialog) => {
    return Application.instance.dialogs.isVisible(dialog);
  });

  ipcMain.on(`show-tab-preview-${id}`, (e, tab) => {
    const dialog = Application.instance.dialogs.getPersistent(
      'preview',
    ) as PreviewDialog;
    dialog.tab = tab;
    dialog.show(appWindow.win);
  });

  ipcMain.on(`hide-tab-preview-${id}`, (e, tab) => {
    const dialog = Application.instance.dialogs.getPersistent(
      'preview',
    ) as PreviewDialog;
    dialog.hide();
  });

  ipcMain.on(`find-show-${id}`, () => {
    showFindDialog(appWindow.win);
  });

  ipcMain.on(`find-in-page-${id}`, () => {
    appWindow.send('find');
  });

  // ipcMain.on(`show-tab-preview-${id}`, (e, tab) => {
  //   appWindow.dialogs.previewDialog.tab = tab;
  //   appWindow.dialogs.previewDialog.show();
  // });

  // ipcMain.on(`hide-tab-preview-${id}`, (e, tab) => {
  //   appWindow.dialogs.previewDialog.hide(
  //     appWindow.dialogs.previewDialog.visible,
  //   );
  // });

  // ipcMain.on(`show-tabgroup-dialog-${id}`, (e, tabGroup) => {
  //   appWindow.dialogs.tabGroupDialog.edit(tabGroup);
  // });

  // ipcMain.on(`show-downloads-dialog-${id}`, (e, left, top) => {
  //   appWindow.dialogs.downloadsDialog.left = left;
  //   appWindow.dialogs.downloadsDialog.top = top;
  //   appWindow.dialogs.downloadsDialog.show();
  // });

  // ipcMain.on(`show-extension-popup-${id}`, (e, left, top, url, inspect) => {
  //   appWindow.dialogs.extensionPopup.left = left;
  //   appWindow.dialogs.extensionPopup.top = top;
  //   appWindow.dialogs.extensionPopup.url = url;
  //   appWindow.dialogs.extensionPopup.show(inspect);
  // });

  // ipcMain.on(`hide-extension-popup-${id}`, (e) => {
  //   if (appWindow.dialogs.extensionPopup.visible) {
  //     appWindow.dialogs.extensionPopup.hideVisually();
  //   }
  // });

  // ipcMain.on(`show-add-bookmark-dialog-${id}`, (e, left, top) => {
  //   appWindow.dialogs.addBookmarkDialog.left = left;
  //   appWindow.dialogs.addBookmarkDialog.top = top;
  //   appWindow.dialogs.addBookmarkDialog.show();
  // });

  // ipcMain.on(`show-zoom-dialog-${id}`, (e, left, top) => {
  //   appWindow.dialogs.zoomDialog.left = left;
  //   appWindow.dialogs.zoomDialog.top = top;
  //   appWindow.dialogs.zoomDialog.show();
  // });

  // ipcMain.on(`edit-tabgroup-${id}`, (e, tabGroup) => {
  //   appWindow.send(`edit-tabgroup`, tabGroup);
  // });

  ipcMain.on(`is-incognito-${id}`, (e) => {
    e.returnValue = appWindow.incognito;
  });

  ipcMain.on(`form-fill-show-${id}`, async (e, rect, name, value) => {
    const items = await getFormFillMenuItems(name, value);

    if (items.length) {
      appWindow.dialogs.formFillDialog.send(`formfill-get-items`, items);
      appWindow.dialogs.formFillDialog.inputRect = rect;

      appWindow.dialogs.formFillDialog.resize(
        items.length,
        items.find((r) => r.subtext) != null,
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
      const url = appWindow.viewManager.selected.url;
      const { hostname } = parse(url);

      const item =
        _id &&
        (await Application.instance.storage.findOne<IFormFillData>({
          scope: 'formfill',
          query: { _id },
        }));

      if (item && item.type === 'password') {
        item.fields.password = await getPassword(
          'wexond',
          `${hostname}-${item.fields.username}`,
        );
      }

      appWindow.viewManager.selected.send(
        `form-fill-update-${id}`,
        item,
        persistent,
      );
    },
  );

  ipcMain.on(`credentials-show-${id}`, (e, data) => {
    appWindow.dialogs.credentialsDialog.send('credentials-update', data);
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
      const item = await Application.instance.storage.insert<IFormFillData>({
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
      await Application.instance.storage.update({
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

    appWindow.send(`has-credentials-${view.id}`, true);
  });

  ipcMain.on(`credentials-remove-${id}`, async (e, data: IFormFillData) => {
    const { _id, fields } = data;
    const view = appWindow.viewManager.selected;

    await Application.instance.storage.remove({
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

  ipcMain.handle(
    `show-bookmarks-bar-dropdown-${id}`,
    (
      event,
      folderId: string,
      bookmarks: IBookmark[],
      { x, y }: { x: number; y: number },
    ) => {
      bookmarkMenu
        .createDropdown(appWindow, folderId, bookmarks)
        .popup({ x: Math.floor(x), y: Math.floor(y), window: appWindow.win });
    },
  );
  ipcMain.handle(
    `show-bookmarks-bar-context-menu-${id}`,
    (event, item: IBookmark) => {
      bookmarkMenu.createMenu(appWindow, item).popup({ window: appWindow.win });
    },
  );
};
