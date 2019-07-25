import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import { IFormFillMenuItem } from '~/interfaces';
export class Store {
  @observable
  public items: IFormFillMenuItem[] = [];

  constructor() {
    ipcRenderer.on(
      'formfill-get-items',
      (e: any, items: any) => {
        this.items = items;
      },
    );
  }
}

export default new Store();
