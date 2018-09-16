import { observable } from 'mobx';

import BookmarksDialog from '../components/BookmarksDialog';
import { databases } from '@/constants/app';
import { Bookmark } from '@/interfaces';
import store from '.';
import { moveItem } from '@/utils/arrays';

export class BookmarksStore {
  @observable
  public bookmarks: Bookmark[] = [];

  @observable
  public dialogVisible = false;

  public dialogRef: BookmarksDialog;

  public load() {
    return new Promise(async resolve => {
      databases.bookmarks
        .find({})
        .sort({ order: 1 })
        .exec((err: any, items: Bookmark[]) => {
          if (err) return console.warn(err);
          this.bookmarks = items;
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
    const siblingItems = this.bookmarks.filter(e => e.parent === parent);
    const data: Bookmark = {
      title,
      parent,
      type: 'folder',
      order: siblingItems.length,
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
    if (item == null) return;

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

  public reorderItemDB(id: string, index: number) {
    databases.bookmarks.update(
      { _id: id },
      { $set: { order: index } },
      {},
      (err: any) => {
        if (err) return console.warn(err);
      },
    );
  }

  public reorderItem(
    id: string,
    parent: string,
    oldIndex: number,
    newIndex: number,
  ) {
    const reorderedItem = this.bookmarks[oldIndex];

    moveItem(this.bookmarks, oldIndex, newIndex);

    reorderedItem.order = newIndex;

    if (oldIndex < newIndex) {
      for (let i = oldIndex; i < newIndex; i++) {
        const item = this.bookmarks[i];
        item.order--;
        this.reorderItemDB(item._id, item.order);
      }
    } else {
      for (let i = newIndex + 1; i <= oldIndex; i++) {
        const item = this.bookmarks[i];
        item.order++;
        this.reorderItemDB(item._id, item.order);
      }
    }

    this.reorderItemDB(id, newIndex);
  }
}
