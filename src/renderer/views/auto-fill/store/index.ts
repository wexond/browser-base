import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import { DialogStore } from '~/models/dialog-store';
import { IAutoFillMenuItem } from '~/interfaces';

export class Store extends DialogStore {
  @observable
  public items: IAutoFillMenuItem[] = [];

  constructor() {
    super({ hideOnBlur: false });

    ipcRenderer.on(`auto-fill-menu-items`, (e, items: IAutoFillMenuItem[]) => {
      this.items = items;
    });
  }
}

export default new Store();
