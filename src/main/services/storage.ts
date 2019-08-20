import { ipcMain } from 'electron';
import * as Datastore from 'nedb';

import { getPath } from '~/utils';
import {
  IFindOperation,
  IInsertOperation,
  IRemoveOperation,
  IUpdateOperation,
} from '~/interfaces';

interface Databases {
  [key: string]: Datastore;
}

export class StorageService {
  public databases: Databases = {
    favicons: null,
    bookmarks: null,
    history: null,
    formfill: null,
    startupTabs: null,
  };

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

  public run() {
    for (const key in this.databases) {
      this.databases[key] = this.createDatabase(key.toLowerCase());
    }
  }

  private createDatabase = (name: string) => {
    return new Datastore({
      filename: getPath(`storage/${name}.db`),
      autoload: true,
    });
  };
}

export default new StorageService();
