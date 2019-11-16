import { ipcMain } from 'electron';
import * as Datastore from 'nedb';
import * as fileType from 'file-type';
import * as icojs from 'icojs';

import { getPath, requestURL } from '~/utils';
import {
  IFindOperation,
  IInsertOperation,
  IRemoveOperation,
  IUpdateOperation,
  IHistoryItem,
  IVisitedItem,
  IFavicon,
} from '~/interfaces';
import { countVisitedTimes } from '~/utils/history';

interface Databases {
  [key: string]: Datastore;
}

const convertIcoToPng = async (icoData: Buffer): Promise<ArrayBuffer> => {
  return (await icojs.parse(icoData, 'image/png'))[0].buffer;
};

export class StorageService {
  public databases: Databases = {
    favicons: null,
    bookmarks: null,
    history: null,
    formfill: null,
    startupTabs: null,
    permissions: null,
  };

  public history: IHistoryItem[] = [];

  public historyVisited: IVisitedItem[] = [];

  public favicons: Map<string, string> = new Map();

  public constructor() {
    ipcMain.on('storage-get', async (e, id: string, data: IFindOperation) => {
      const docs = await this.find(data);
      e.sender.send(id, docs);
    });

    ipcMain.on(
      'storage-get-one',
      async (e, id: string, data: IFindOperation) => {
        const doc = await this.findOne(data);
        e.sender.send(id, doc);
      },
    );

    ipcMain.on(
      'storage-insert',
      async (e, id: string, data: IInsertOperation) => {
        const doc = await this.insert(data);
        e.sender.send(id, doc);
      },
    );

    ipcMain.on(
      'storage-remove',
      async (e, id: string, data: IRemoveOperation) => {
        const numRemoved = await this.remove(data);
        e.sender.send(id, numRemoved);
      },
    );

    ipcMain.on(
      'storage-update',
      async (e, id: string, data: IUpdateOperation) => {
        const numReplaced = await this.update(data);
        e.sender.send(id, numReplaced);
      },
    );

    ipcMain.handle('history-get', e => {
      return this.history;
    });

    ipcMain.on('history-remove', (e, ids: string[]) => {
      this.history.filter(x => ids.indexOf(x._id) === -1);
      ids.forEach(x => this.remove({ scope: 'history', query: { _id: x } }));
    });

    ipcMain.handle('topsites-get', (e, count) => {
      return this.historyVisited.slice(0, count);
    });
  }

  public find<T>(data: IFindOperation): Promise<T[]> {
    const { scope, query } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].find(query, (err: any, docs: any) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  }

  public findOne<T>(data: IFindOperation): Promise<T> {
    const { scope, query } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].findOne(query, (err: any, doc: any) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  public insert<T>(data: IInsertOperation): Promise<T> {
    const { scope, item } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].insert(item, (err: any, doc: any) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  public remove(data: IRemoveOperation): Promise<number> {
    const { scope, query, multi } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].remove(
        query,
        { multi },
        (err: any, removed: number) => {
          if (err) reject(err);
          resolve(removed);
        },
      );
    });
  }

  public update(data: IUpdateOperation): Promise<number> {
    const { scope, query, value, multi } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].update(
        query,
        { $set: value },
        { multi },
        (err: any, replaced: number) => {
          if (err) reject(err);
          resolve(replaced);
        },
      );
    });
  }

  public async run() {
    for (const key in this.databases) {
      this.databases[key] = this.createDatabase(key.toLowerCase());
    }

    (await this.find<IFavicon>({ scope: 'favicons', query: {} })).forEach(
      favicon => {
        const { data } = favicon;

        if (this.favicons.get(favicon.url) == null) {
          this.favicons.set(favicon.url, data);
        }
      },
    );

    const items: IHistoryItem[] = await this.find({
      scope: 'history',
      query: {},
    });

    items.sort((a, b) => {
      let aDate = a.date;
      let bDate = b.date;

      if (typeof aDate === 'string') {
        aDate = new Date(a.date).getTime();
        bDate = new Date(b.date).getTime();
      }

      return aDate - bDate;
    });

    this.history = items;

    this.historyVisited = countVisitedTimes(items);

    this.historyVisited = this.historyVisited.map(x => ({
      ...x,
      favicon: this.favicons.get(x.favicon),
    }));
  }

  private createDatabase = (name: string) => {
    return new Datastore({
      filename: getPath(`storage/${name}.db`),
      autoload: true,
    });
  };

  public addFavicon = async (url: string): Promise<string> => {
    return new Promise(async resolve => {
      if (!this.favicons.get(url)) {
        try {
          const res = await requestURL(url);

          if (res.statusCode === 404) {
            throw new Error('404 favicon not found');
          }

          let data = Buffer.from(res.data, 'binary');

          const type = fileType(data);

          if (type && type.ext === 'ico') {
            data = Buffer.from(new Uint8Array(await convertIcoToPng(data)));
          }

          const str = `data:${fileType(data).ext};base64,${data.toString(
            'base64',
          )}`;

          this.insert({
            scope: 'favicons',
            item: {
              url,
              data: str,
            },
          });

          this.favicons.set(url, str);

          resolve(str);
        } catch (e) {
          throw e;
        }
      } else {
        resolve(this.favicons.get(url));
      }
    });
  };
}

export default new StorageService();
