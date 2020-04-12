import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import { DialogStore } from '~/models/dialog-store';
import { IAutoFillMenuData } from '~/interfaces';

export class Store extends DialogStore {
  @observable
  public data: IAutoFillMenuData;

  constructor() {
    super({ hideOnBlur: false });

    ipcRenderer.on(`auto-fill-menu-data`, (e, data: IAutoFillMenuData) => {
      this.data = data;
    });
  }
}

export default new Store();
