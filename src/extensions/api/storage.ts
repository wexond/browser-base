import { ipcRenderer } from 'electron';

import { API } from '.';
import { makeId } from '~/shared/utils/string';

// https://developer.chrome.com/extensions/storage

let api: API;

const sendStorageOperation = (
  extensionId: string,
  arg: any,
  area: string,
  type: string,
  callback: any,
) => {
  const id = makeId(32);
  ipcRenderer.send('api-storage-operation', {
    extensionId,
    id,
    arg,
    type,
    area,
  });

  if (callback) {
    ipcRenderer.once(
      `api-storage-operation-${id}`,
      (e: any, ...data: any[]) => {
        callback(data[0]);
      },
    );
  }
};

export class StorageArea {
  private _area: string;

  constructor(area: string) {
    this._area = area;
  }

  public set = (arg: any, cb: any) => {
    sendStorageOperation(api.runtime.id, arg, this._area, 'set', cb);
  };

  public get = (arg: any, cb: any) => {
    sendStorageOperation(api.runtime.id, arg, this._area, 'get', cb);
  };

  public remove = (arg: any, cb: any) => {
    sendStorageOperation(api.runtime.id, arg, this._area, 'remove', cb);
  };

  public clear = (arg: any, cb: any) => {
    sendStorageOperation(api.runtime.id, arg, this._area, 'clear', cb);
  };
}

export class Storage {
  public local = new StorageArea('local');
  public sync = new StorageArea('sync');
  public managed = new StorageArea('managed');

  constructor(_api: API) {
    api = _api;
  }
}
