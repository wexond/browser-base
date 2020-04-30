import {
  Menu,
  nativeImage,
  NativeImage,
  MenuItemConstructorOptions,
  app,
  BrowserWindow,
  MenuItem,
} from 'electron';
import { join } from 'path';
import { IBookmark } from '~/interfaces';
import { Application } from '../application';

function getPath(file: string) {
  if (process.env.NODE_ENV === 'development') {
    return join(
      app.getAppPath(),
      'src',
      'renderer',
      'resources',
      'icons',
      `${file}.png`,
    );
  } else {
    const path = require(`~/renderer/resources/icons/${file}.png`);
    return join(app.getAppPath(), `build`, path);
  }
}

function getIcon(
  favicon: string | undefined,
  isFolder: boolean,
): NativeImage | string {
  if (favicon) {
    let dataURL = Application.instance.storage.favicons.get(favicon);
    if (dataURL) {
      // some favicon data urls have a corrupted base 64 file type descriptor
      // prefixed with data:png;base64, instead of data:image/png;base64,
      // see: https://github.com/electron/electron/issues/23369
      if (!dataURL.split(',')[0].includes('image')) {
        const split = dataURL.split(':');
        dataURL = split.join(':image/');
      }

      const image = nativeImage
        .createFromDataURL(dataURL)
        .resize({ width: 16, height: 16 });
      return image;
    }
  }

  if (Application.instance.settings.object.theme === 'wexond-dark') {
    if (isFolder) {
      return getPath('folder_light');
    } else {
      return getPath('page_light');
    }
  } else {
    if (isFolder) {
      return getPath('folder_dark');
    } else {
      return getPath('page_dark');
    }
  }
}

export function createDropdown(
  parentID: string,
  bookmarks: IBookmark[],
): Electron.Menu {
  const folderBookmarks = bookmarks.filter(
    ({ static: staticName, parent }) => !staticName && parent === parentID,
  );
  const template = folderBookmarks.map<MenuItemConstructorOptions>(
    ({ title, url, favicon, isFolder, _id }) => ({
      click: url
        ? (menuItem, browserWindow) => {
            const win = Application.instance.windows.list.find(
              (x) => x.win.id === browserWindow.id,
            );
            win.viewManager.create({ url, active: true });
          }
        : undefined,
      label: title,
      icon: getIcon(favicon, isFolder),
      submenu: isFolder ? createDropdown(_id, bookmarks) : undefined,
      id: _id,
    }),
  );

  return template.length > 0
    ? Menu.buildFromTemplate(template)
    : Menu.buildFromTemplate([{ label: '(empty)', enabled: false }]);
}

export function createMenu(item: IBookmark) {
  const { isFolder, url } = item;
  const folderItems: MenuItemConstructorOptions[] = [
    {
      label: 'Open in New Tab',
      click: (menuItem: MenuItem, browserWindow: BrowserWindow) => {
        const win = Application.instance.windows.list.find(
          (x) => x.win.id === browserWindow.id,
        );
        win.viewManager.create({ url, active: true });
      },
    },
    {
      type: 'separator',
    },
  ];

  const template: MenuItemConstructorOptions[] = [
    ...(!isFolder ? folderItems : []),
    {
      label: 'Edit',
      click: () => {
        console.log('edit', item);
        // TODO: Handle edit bookmark event with bookmark dialog
        // ipcRenderer.send(
        //   `show-add-bookmark-dialog-${this.store.windowId}`,
        //   50,
        //   document.body.offsetWidth - 300,
        // );
      },
    },
    {
      label: 'Delete',
      click: () => {
        Application.instance.storage.removeBookmark(item._id);
      },
    },
  ];

  return Menu.buildFromTemplate(template);
}
