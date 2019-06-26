import { observable } from 'mobx';
import { ipcRenderer } from 'electron';

export class Store {
  @observable
  public url: string;

  constructor() {
    ipcRenderer.on('request-auth', (e: any, url: string) => {
      this.url = url;
    });
  }
}

export default new Store();
