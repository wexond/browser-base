import { observable } from 'mobx';

import BookmarksDialog from '../components/BookmarksDialog';
import { databases } from '~/defaults/databases';
import { Bookmark } from '~/interfaces';
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
    databases.bookmarks.insert(item, (err: any, doc: Bookmark) => {
      store.bookmarksStore.bookmarks.push(doc);
    });
    return item;
  }

  public addFolder(title: string, parent: string) {
    databases.bookmarks.insert(
      {
        title,
        parent,
        type: 'folder',
      },
      (err: any, doc: Bookmark) => {
        if (err) return console.warn(err);
        this.bookmarks.push(doc);
      },
    );
  }

  public isBookmarked(url: string) {
    // console.log(url, this.bookmarks);
    return !!this.bookmarks.find(x => x.url === url);
  }

  public load() {
    return new Promise(async resolve => {
      databases.bookmarks.find({}, (err: any, docs: Bookmark[]) => {
        if (err) return console.warn(err);
        this.bookmarks = docs;
        resolve();
      });
    });
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

    databases.bookmarks.remove({ _id: item._id }, (err: any) => {
      if (err) return console.warn(err);
    });
  }
}
