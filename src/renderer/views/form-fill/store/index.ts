import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import { IFormFillMenuItem } from '~/interfaces';
import { getCurrentWindow } from '../../app/utils/windows';
export class Store {
  @observable
  public items: IFormFillMenuItem[] = [];

  public windowId: number = ipcRenderer.sendSync(
    `get-window-id-${getCurrentWindow().id}`,
  );

  public constructor() {
    ipcRenderer.on(`formfill-get-items`, (e, items) => {
      this.items = items;
    });
  }
}

export default new Store();
