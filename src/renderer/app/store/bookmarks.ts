import { observable } from 'mobx';

import BookmarksDialog from '../components/BookmarksDialog';
import { databases } from '@/constants/app';
import { Bookmark } from '@/interfaces';
import store from '.';

export class BookmarksStore {
  @observable
  public bookmarks: Bookmark[] = [];

  @observable
  public dialogVisible = false;

  public dialogRef: BookmarksDialog;

  public load() {
    return new Promise(async resolve => {
      databases.bookmarks.find({}, (err: any, docs: Bookmark[]) => {
        if (err) return console.warn(err);
        this.bookmarks = docs;
        resolve();
      });
    });
  }

  public isBookmarked(url: string) {
    return !!this.bookmarks.find(x => x.url === url);
  }

  public async addBookmark(item: Bookmark) {
    databases.bookmarks.insert(item, (err: any, item: Bookmark) => {
      if (err) return console.warn(err);
      this.bookmarks.push(item);

      for (const page of store.pagesStore.pages) {
        if (page.wexondPage === 'bookmarks') {
          page.webview.send('bookmarks-add', item);
        }
      }
    });

    return item;
  }

  public addFolder(title: string, parent: string) {
    const data: Bookmark = {
      title,
      parent,
      type: 'folder',
    };

    databases.bookmarks.insert(data, (err: any, item: Bookmark) => {
      if (err) return console.warn(err);
      this.bookmarks.push(item);

      for (const page of store.pagesStore.pages) {
        if (page.wexondPage === 'bookmarks') {
          page.webview.send('bookmarks-add', item);
        }
      }
    });
  }

  public async removeItem(id: string | Bookmark) {
    const index =
      typeof id === 'string'
        ? this.bookmarks.findIndex(x => x._id === id)
        : this.bookmarks.indexOf(id);

    const item = this.bookmarks[index];
    if (item == null) return;

    this.bookmarks.splice(index, 1);

    if (item.type === 'folder') {
      const items = this.bookmarks.filter(x => x.parent === item._id);

      for (const bookmark of items) {
        this.removeItem(bookmark);
      }
    }

    for (const page of store.pagesStore.pages) {
      const tab = store.tabsStore.getTabById(page.id);

      if (item.type === 'item' && tab.url === item.url) {
        tab.isBookmarked = false;
      }

      if (page.wexondPage === 'bookmarks') {
        page.webview.send('bookmarks-delete', item);
      }
    }

    databases.bookmarks.remove({ _id: item._id }, (err: any) => {
      if (err) return console.warn(err);
    });
  }

  public editItem(id: string, title: string, parent: string) {
    const item = this.bookmarks.find(x => x._id === id);

    item.title = title;
    item.parent = parent;

    for (const page of store.pagesStore.pages) {
      if (page.wexondPage === 'bookmarks') {
        page.webview.send('bookmarks-edit', item);
      }
    }

    databases.bookmarks.update(
      { _id: id },
      { $set: { title, parent } },
      {},
      (err: any) => {
        if (err) return console.warn(err);
      },
    );
  }
}
