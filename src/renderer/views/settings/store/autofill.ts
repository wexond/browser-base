import { observable, action, makeObservable } from 'mobx';

import { IFormFillData } from '~/interfaces';
import { PreloadDatabase } from '~/preloads/models/database';

export class AutoFillStore {
  public db = new PreloadDatabase<IFormFillData>('formfill');

  @observable
  public credentials: IFormFillData[] = [];

  @observable
  public addresses: IFormFillData[] = [];

  @observable
  public menuVisible = false;

  @observable
  public menuTop = 0;

  @observable
  public menuLeft = 0;

  @observable
  public selectedItem: IFormFillData = null;

  public constructor() {
    makeObservable(this);

    this.load();

    window.addEventListener('message', ({ data }) => {
      if (data.type === 'credentials-insert') {
        this.credentials.push(data.data);
      } else if (data.type === 'credentials-update') {
        const { _id, username, passLength } = data.data;
        const item = this.credentials.find((r) => r._id === _id);

        item.fields = {
          username,
          passLength,
        };
      } else if (data.type === 'credentials-remove') {
        const { _id } = data.data;
        this.credentials = this.credentials.filter((r) => r._id !== _id);
      }
    });
  }

  @action
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
