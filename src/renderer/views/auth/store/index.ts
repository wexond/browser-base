import { observable } from 'mobx';
import { ipcRenderer } from 'electron';
import { getCurrentWindow } from '../../app/utils/windows';

export class Store {
  @observable
  public url: string;

  public windowId: number = ipcRenderer.sendSync(
    `get-window-id-${getCurrentWindow().id}`,
  );

  constructor() {
    ipcRenderer.on('request-auth', (e: any, url: string) => {
      this.url = url;
    });
  }
}

export default new Store();
