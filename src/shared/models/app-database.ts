import Dexie from 'dexie';
import HistoryItem from './history-item';
import BookmarksFolder from './bookmarks-folder';
import BookmarksPage from './bookmarks-page';
import { Favicon } from './favicon';

export class AppDatabase extends Dexie {
  public history: Dexie.Table<HistoryItem, number>;

  public favicons: Dexie.Table<Favicon, number>;

  public bookmarksFolder: Dexie.Table<BookmarksFolder, number>;

  public bookmarksPages: Dexie.Table<BookmarksPage, number>;

  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      history: '++id, title, url, favicon, date',
      favicons: '++id, url, favicon',
      bookmarksFolder: '++id, title, folders, items',
      bookmarksPage: '++id, title, url, favicon',
    });
  }

  public async addFavicon(url: string) {
    const count = await this.favicons
      .where('url')
      .equals(url)
      .count();

    if (count === 0) {
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            const generatedBuffer = reader.result;
            this.transaction('rw', this.favicons, async () => {
              if (count === 0) {
                this.favicons.add({
                  url,
                  favicon: Buffer.from(generatedBuffer),
                });
              }
            });
          };
          reader.readAsArrayBuffer(blob);
        });
    }
  }
}

export default new AppDatabase();
