import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import { IFormFillMenuItem } from '~/interfaces';
import { getCurrentWindow } from '../../app/utils/windows';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public items: IFormFillMenuItem[] = [];

  public windowId: number = getCurrentWindow().id;

  public constructor() {
    super({ hideOnBlur: false });

    ipcRenderer.on(`formfill-get-items`, (e, items) => {
      this.items = items;
    });
  }
}

export default new Store();
