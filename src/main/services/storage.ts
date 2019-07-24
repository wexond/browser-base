import { ipcMain } from 'electron';
import * as Datastore from 'nedb';
import { getPath } from '~/utils';

interface Databases {
  [key: string]: Datastore;
}

export class StorageService {
  public databases: Databases = {
    favicons: null,
    bookmarks: null,
    history: null,
    formfill: null,
  };

  constructor() {
    ipcMain.on('storage-insert', (e, id: string, scope: string, item: any) => {
      this.databases[scope].insert(item, (err: any, doc: any) => {
        if (err) return console.error(err);
        e.sender.send(id, doc);
      });
    });

    ipcMain.on('storage-get', (e, id: string, scope: string, query: any) => {
      this.databases[scope].find(query, (err: any, docs: any) => {
        if (err) return console.error(err);
        e.sender.send(id, docs);
      });
    });

    ipcMain.on(
      'storage-remove',
      (e, id: string, scope: string, query: any, multi: boolean) => {
        this.databases[scope].remove(
          query,
          { multi },
          (err: any, numRemoved: number) => {
            if (err) return console.error(err);
            e.sender.send(id, numRemoved);
          },
        );
      },
    );

    ipcMain.on(
      'storage-update',
      (e, id: string, scope: string, query: any, value: any, multi: boolean) => {
        this.databases[scope].update(
          query,
          { $set: value },
          { multi },
          (err: any, numReplaced: number) => {
            if (err) return console.error(err);
            e.sender.send(id, numReplaced);
          },
        );
      },
    );
  }

  public run() {
    for (const key in this.databases) {
      this.databases[key] = this.createDatabase(key);
    }
  }

  private createDatabase = (name: string) => {
    return new Datastore({
      filename: getPath(`storage/${name}.db`),
      autoload: true,
    });
  }
}

export default new StorageService();
