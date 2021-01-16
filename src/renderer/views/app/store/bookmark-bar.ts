import { Menu, ipcRenderer } from 'electron';
import { makeObservable, observable, toJS } from 'mobx';
import { IBookmark } from '~/interfaces';
import { Store } from '../store';

export class BookmarkBarStore {
  public buttonWidth = 150;
  public overflowMenu: Menu;
  private staticMainID: string;
  private store: Store;

  public list: IBookmark[] = [];

  public bookmarkBarItems: IBookmark[] = [];

  public overflowItems: IBookmark[] = [];

  public constructor(store: Store) {
    makeObservable(this, {
      list: observable,
      bookmarkBarItems: observable,
      overflowItems: observable,
    });

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
    const barWidth = document.body.clientWidth - 65;
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

    ipcRenderer.send('bookmarks-remove', toJS(ids));
  }

  public showOverflow = (event: any) => {
    const clientRect = event.target.getBoundingClientRect();
    const y = Math.floor(clientRect.bottom) + 5;
    const x = Math.floor(clientRect.left) + 20;

    ipcRenderer.invoke(
      `show-bookmarks-bar-dropdown-${this.store.windowId}`,
      this.staticMainID,
      toJS(this.overflowItems),
      { x, y },
    );
  };

  public showFolderDropdown = (event: any, id: string) => {
    const clientRect = event.target.getBoundingClientRect();
    const y = Math.floor(clientRect.bottom) + 12;
    const x = Math.floor(clientRect.left) - 30;

    const bookmarks = toJS(this.list);
    ipcRenderer.invoke(
      `show-bookmarks-bar-dropdown-${this.store.windowId}`,
      id,
      bookmarks,
      {
        x,
        y,
      },
    );
  };

  public createContextMenu(event: unknown, id: string) {
    const item = this.list.find(({ _id }) => _id === id);
    ipcRenderer.invoke(
      `show-bookmarks-bar-context-menu-${this.store.windowId}`,
      toJS(item),
    );
  }

  private handleWindowResize() {
    let debounceTimer: any;

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
