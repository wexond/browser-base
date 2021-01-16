import { action, makeAutoObservable } from 'mobx';
import { ipcRenderer } from 'electron';

import { IFormFillData } from '~/interfaces';
import { Database } from '~/models/database';

export class AutoFillStore {
  public db = new Database<IFormFillData>('formfill');

  public credentials: IFormFillData[] = [];

  public addresses: IFormFillData[] = [];

  public menuVisible = false;

  public menuTop = 0;

  public menuLeft = 0;

  public selectedItem: IFormFillData;

  public constructor() {
    makeAutoObservable(this, { load: action, removeItem: action, db: false });

    this.load();

    ipcRenderer.on('credentials-insert', (e, data) => {
      this.credentials.push(data);
    });

    ipcRenderer.on('credentials-update', (e, data) => {
      const { _id, username, passLength } = data;
      const item = this.credentials.find((r) => r._id === _id);

      item.fields = {
        username,
        passLength,
      };
    });
  }

  public async load() {
    const items = await this.db.get({});

    this.credentials = items.filter((r) => r.type === 'password');
    this.addresses = items.filter((r) => r.type === 'address');
  }

  public async removeItem(data: IFormFillData) {
    await this.db.remove({ _id: data._id });

    if (data.type === 'password') {
      this.credentials = this.credentials.filter((r) => r._id !== data._id);
    } else {
      this.addresses = this.addresses.filter((r) => r._id !== data._id);
    }
  }
}
