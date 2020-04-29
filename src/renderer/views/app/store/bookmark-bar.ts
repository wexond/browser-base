import {
  remote,
  Menu,
  MenuItemConstructorOptions,
  ipcRenderer,
  NativeImage,
} from 'electron';
import { join } from 'path';
import { observable, toJS } from 'mobx';
import { IBookmark } from '~/interfaces';
import { Store } from './';

function getPath(file: string) {
  if (process.env.NODE_ENV === 'development') {
    return join(
      remote.app.getAppPath(),
      'src',
      'renderer',
      'resources',
      'icons',
      `${file}.png`,
    );
  } else {
    const path = require(`~/renderer/resources/icons/${file}.png`);
    return join(remote.app.getAppPath(), `build`, path);
  }
}

export class BookmarkBarStore {
  public buttonWidth = 150;
  public overflowMenu: Menu;
  private staticMainID: string;
  private store: Store;

  @observable
  public list: IBookmark[] = [];
  @observable
  public bookmarkBarItems: IBookmark[] = [];
  @observable
  public overflowItems: IBookmark[] = [];

  public constructor(store: Store) {
    this.store = store;

    this.load();

    this.handleWindowResize();
    ipcRenderer.on('reload-bookmarks', () => {
      this.load();
    });
  }

  public async load() {
    const items: IBookmark[] = await ipcRenderer.invoke('bookmarks-get');
    this.staticMainID = items.find((x) => x.static === 'main')._id;
    this.list = items;
    this.setBookmarkBarItems();
  }

  public setBookmarkBarItems(): void {
    // handle calculating how many and which bookmarks we can fit in the bar and which ones need to go in the overflow menu
    if (!this.staticMainID) return;
    const barItems: IBookmark[] = [];
    const overflowItems: IBookmark[] = [];
    const barWidth = document.body.clientWidth - 50;
    const maxChars = 18;
    let currentWidth = 0;
    const potentialItems = this.list.filter(
      ({ parent }) => parent === this.staticMainID,
    );
    potentialItems.forEach((el) => {
      if (currentWidth >= barWidth) {
        overflowItems.push(el);
      } else {
        if (el.title.length < maxChars) {
          const realWidth =
            ((this.buttonWidth - 36) / maxChars) * el.title.length;
          currentWidth += realWidth + 36;
        } else {
          currentWidth += this.buttonWidth;
        }
        if (currentWidth < barWidth) {
          barItems.push(el);
        } else {
          overflowItems.push(el);
        }
      }
    });
    this.bookmarkBarItems = barItems;
    this.overflowItems = overflowItems;
  }

  public removeItems(ids: string[]) {
    for (const id of ids) {
      const item = this.list.find((x) => x._id === id);
      const parent = this.list.find((x) => x._id === item.parent);
      parent.children = parent.children.filter((x) => x !== id);
    }
    this.list = this.list.filter((x) => !ids.includes(x._id));

    ipcRenderer.send(
      'bookmarks-remove',
      toJS(ids, { recurseEverything: true }),
    );
  }

  public showOverflow = (event: any) => {
    const clientRect = event.target.getBoundingClientRect();
    // TODO: fix menu positioning
    const y = clientRect.bottom + 5;
    const x = clientRect.right + 5;
    this.createDropdown(this.staticMainID, this.overflowItems).popup();
  };

  public showFolderDropdown = (event: any, id: string) => {
    const clientRect = event.target.getBoundingClientRect();
    // TODO: fix menu positioning
    const y = Number(clientRect.bottom.toFixed()) + 12;
    const x = clientRect.left.toFixed() - 50;

    const dropdown = this.createDropdown(id, this.list);
    dropdown.popup();
  };

  public createContextMenu(event: any, id: string) {
    this.createMenu(id).popup();
  }

  private createDropdown = (
    parentID: string,
    bookmarks: IBookmark[],
  ): Electron.Menu => {
    const folderBookmarks = bookmarks.filter(
      ({ static: staticName, parent }) => !staticName && parent === parentID,
    );
    const template = folderBookmarks.map<MenuItemConstructorOptions>(
      ({ title, url, favicon, isFolder, _id }) => ({
        click: url
          ? (menuItem, browserWindow, e) =>
              ipcRenderer.send(`add-tab-${browserWindow.id}`, {
                url,
                active: true,
              })
          : undefined,
        label: title,
        // TODO: some favicons don't appear
        icon: this.getIcon(favicon, isFolder),
        submenu: isFolder ? this.createDropdown(_id, this.list) : undefined,
        id: _id,
      }),
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return template.length > 0
      ? remote.Menu.buildFromTemplate(template)
      : remote.Menu.buildFromTemplate([{ label: '(empty)', enabled: false }]);
  };

  private createMenu(id: string) {
    const item = this.list.find((x) => x._id === id);
    if (!item) return;

    const { isFolder } = item;
    const template = [
      ...(!isFolder
        ? [
            {
              label: 'Open in New Tab',
              click: () => {
                this.store.tabs.addTab({ url: item.url });
              },
            },
            {
              type: 'separator',
            },
          ]
        : []),
      {
        label: 'Edit',
        click: () => {
          console.log('edit', id);
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
          this.removeItems([id]);
        },
      },
    ];

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return remote.Menu.buildFromTemplate(template);
  }

  private getIcon(
    favicon: string | undefined,
    isFolder: boolean,
  ): NativeImage | string {
    if (favicon) {
      return remote.nativeImage.createFromDataURL(favicon);
    }

    if (this.store.theme['toolbar.lightForeground']) {
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

  private handleWindowResize() {
    let debounceTimer: number;

    window.addEventListener('resize', () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        this.setBookmarkBarItems();
      }, 200);
    });
  }
}
