import { observable } from 'mobx';
import BookmarksDialog from '../components/BookmarksDialog';
import { Bookmark } from '../../../interfaces';
import store from '.';

export class BookmarksStore {
  @observable
  public bookmarks: Bookmark[] = [];

  @observable
  public dialogVisible = false;

  @observable
  public currentTree: string = null;

  @observable
  public path: Bookmark[] = [];

  @observable
  public selectedItems: string[] = [];

  public dialogRef: BookmarksDialog;

  public async addBookmark(item: Bookmark) {
    // TODO: nedb
    /*item.id = await database.bookmarks.add(item);
    store.bookmarks.push(item);*/
    return item;
  }

  public addFolder(title: string, parent: string) {
    // TODO: nedb
    /*database.transaction('rw', database.bookmarks, async () => {
      const item: BookmarkItem = {
        title,
        parent,
        type: 'folder',
      };

      item.id = await database.bookmarks.add(item);
      store.bookmarks.push(item);
    });*/
  }

  public goToFolder(id: string) {
    this.currentTree = id;
    this.path = this.getFolderPath(id);
  }

  public getFolderPath(parent: string) {
    const parentFolder = this.bookmarks.find(x => x._id === parent);
    let path: Bookmark[] = [];

    if (parentFolder == null) {
      return [];
    }

    if (parentFolder.parent != null) {
      path = path.concat(this.getFolderPath(parentFolder.parent));
    }

    path.push(parentFolder);

    return path;
  }

  public async removeItem(item: Bookmark) {
    if (item.type === 'folder') {
      const items = this.bookmarks.filter(x => x.parent === item._id);

      for (const bookmark of items) {
        this.removeItem(bookmark);
      }
    }

    this.bookmarks = this.bookmarks.filter(x => x._id !== item._id);

    const selectedTab = store.tabsStore.getSelectedTab();
    if (selectedTab.isBookmarked && selectedTab.url === item.url) {
      selectedTab.isBookmarked = false;
    }

    // TODO: nedb
    // await database.bookmarks.delete(id);
  }
}
