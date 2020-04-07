import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  public items: any[] = [];

  // @observable
  // public items: IFormFillMenuItem[] = [];
  // public constructor() {
  //   super({ hideOnBlur: false });
  //   ipcRenderer.on(`formfill-get-items`, (e, items) => {
  //     this.items = items;
  //   });
  // }
}

export default new Store();
