import { observable, action } from 'mobx';

import { IFormFillData } from '~/interfaces';

export class AutoFillStore {
  // public db = new Database<IFormFillData>('formfill');

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
  public selectedItem: IFormFillData;

  public constructor() {
    this.load();

    // TODO(xnerhu): preload messages
    /*ipcRenderer.on('credentials-insert', (e, data) => {
      this.credentials.push(data);
    });

    ipcRenderer.on('credentials-update', (e, data) => {
      const { _id, username, passLength } = data;
      const item = this.credentials.find(r => r._id === _id);

      item.fields = {
        username,
        passLength,
      };
    });*/
  }

  @action
  public async load() {
    // TODO(xnerhu): database
    /*
    const items = await this.db.get({});

    this.credentials = items.filter(r => r.type === 'password');
    this.addresses = items.filter(r => r.type === 'address');
    */
  }

  public async removeItem(data: IFormFillData) {
    /*await this.db.remove({ _id: data._id });

    if (data.type === 'password') {
      this.credentials = this.credentials.filter(r => r._id !== data._id);
    } else {
      this.addresses = this.addresses.filter(r => r._id !== data._id);
    }*/
  }
}
