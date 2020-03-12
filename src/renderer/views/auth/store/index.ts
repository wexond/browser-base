import { observable } from 'mobx';
import { ipcRenderer } from 'electron';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public url: string;

  public constructor() {
    super({ hideOnBlur: false });

    ipcRenderer.on('visible', (e, flag) => {
      this.visible = flag;
    });

    ipcRenderer.on('request-auth', (e, url) => {
      this.url = url;
    });
  }
}

export default new Store();
