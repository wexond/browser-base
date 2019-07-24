import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

export class Store {
  constructor() {
    // ipcRenderer.on(
    //   'credentials-dialog-show',
    //   (e: any) => {
    //     this.visible = false;
    //   },
    // );
  }
}

export default new Store();
