import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import { IFormFillItem } from '~/interfaces';

export class Store {
  @observable
  public items: IFormFillItem[] = [];

  constructor() {
    ipcRenderer.on(
      'autocomplete-get-items',
      (e: any, items: any) => {
        this.items = items;
      },
    );
  }
}

export default new Store();
