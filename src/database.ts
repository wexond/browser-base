import Dexie from 'dexie';
import { BookmarkItem, Favicon, HistoryItem } from './interfaces';

export class Database extends Dexie {
  public history: Dexie.Table<HistoryItem, number>;

  public favicons: Dexie.Table<Favicon, number>;

  public bookmarks: Dexie.Table<BookmarkItem, number>;

  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      history: '++id, title, url, favicon, date',
      favicons: '++id, url, favicon',
      bookmarks: '++id, title, url, favicon, parent, type',
    });
  }

  public async addFavicon(url: string) {
    const count = await this.favicons
      .where('url')
      .equals(url)
      .count();

    if (count === 0) {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const generatedBuffer: any = reader.result;
            this.transaction('rw', this.favicons, () => {
              this.favicons.add({
                url,
                favicon: Buffer.from(generatedBuffer),
              });
            });
          };
          reader.readAsArrayBuffer(blob);
        });
    }
  }
}

export default new Database();
