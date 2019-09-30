import { observable } from 'mobx';
import { ipcRenderer, remote } from 'electron';

export class Store {
  @observable
  public url: string;

  public windowId: number = remote.getCurrentWindow().id;

  public constructor() {
    ipcRenderer.on('request-auth', (e, url) => {
      this.url = url;
    });
  }
}

export default new Store();
