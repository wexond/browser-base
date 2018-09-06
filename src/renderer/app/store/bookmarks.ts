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

  public async addBookmark(item: Bookmark) {
    databases.bookmarks.insert(item, (err: any, doc: Bookmark) => {
      store.bookmarksStore.bookmarks.push(doc);

      for (const page of store.pagesStore.pages) {
        if (page.wexondPage === 'bookmarks') {
          page.webview.send('bookmarks-add', doc);
        }
      }
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

    for (const page of store.pagesStore.pages) {
      if (page.wexondPage === 'bookmarks') {
        page.webview.send('bookmarks-remove', item);
      }
    }
  }
}
