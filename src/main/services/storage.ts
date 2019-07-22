import * as Datastore from 'nedb';

import { getPath } from '~/utils';
import { ipcMain } from 'electron';

const createDatabase = (name: string) => {
  return new Datastore({
    filename: getPath(`storage/${name}.db`),
    autoload: true,
  });
};

const databases: { [key: string]: Datastore } = {
  favicons: createDatabase('favicons'),
  bookmarks: createDatabase('bookmarks'),
  history: createDatabase('history'),
};

export const runStorageService = () => {
  ipcMain.on('storage-insert', (e, id: string, scope: string, item: any) => {
    databases[scope].insert(item, (err: any, doc: any) => {
      if (err) return console.error(err);
      e.sender.send(id, doc);
    });
  });

  ipcMain.on('storage-get', (e, id: string, scope: string, query: any) => {
    databases[scope].find(query, (err: any, docs: any) => {
      if (err) return console.error(err);
      e.sender.send(id, docs);
    });
  });

  ipcMain.on(
    'storage-remove',
    (e, id: string, scope: string, query: any, multi: boolean) => {
      databases[scope].remove(
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
      databases[scope].update(
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
};
