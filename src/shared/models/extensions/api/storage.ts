import { ipcRenderer } from 'electron';

import { API } from '.';
import { API_STORAGE_OPERATION } from '@/constants/extensions';
import { makeId } from '@/utils/strings';

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
  ipcRenderer.send(API_STORAGE_OPERATION, {
    extensionId,
    id,
    arg,
    type,
    area,
  });

  if (callback) {
    ipcRenderer.once(API_STORAGE_OPERATION + id, (e: any, ...data: any[]) => {
      callback(data[0]);
    });
  }
};

export class StorageArea {
  // tslint:disable-next-line
  private _area: string;

  constructor(area: string) {
    this._area = area;
  }

  public set(arg: any, cb: any) {
    sendStorageOperation(api.runtime.id, arg, this._area, 'set', cb);
  }

  public get(arg: any, cb: any) {
    sendStorageOperation(api.runtime.id, arg, this._area, 'get', cb);
  }

  public remove(arg: any, cb: any) {
    sendStorageOperation(api.runtime.id, arg, this._area, 'remove', cb);
  }

  public clear(arg: any, cb: any) {
    sendStorageOperation(api.runtime.id, arg, this._area, 'clear', cb);
  }
}

export class Storage {
  public local = new StorageArea('local');
  public sync = new StorageArea('sync');
  public managed = new StorageArea('managed');

  // tslint:disable-next-line
  constructor(_api: API) {
    api = _api;
  }
}
