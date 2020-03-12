import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import { IFormFillMenuItem } from '~/interfaces';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public items: IFormFillMenuItem[] = [];

  public constructor() {
    super({ hideOnBlur: false });

    ipcRenderer.on(`formfill-get-items`, (e, items) => {
      this.items = items;
    });
  }
}

export default new Store();
