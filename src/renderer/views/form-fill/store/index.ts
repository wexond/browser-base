import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import { IFormFillMenuItem } from '~/interfaces';
export class Store {
  @observable
  public items: IFormFillMenuItem[] = [];

  public constructor() {
    ipcRenderer.on('formfill-get-items', (e, items) => {
      this.items = items;
    });
  }
}

export default new Store();
