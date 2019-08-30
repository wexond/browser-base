import { ipcRenderer, remote } from 'electron';
import { observable } from 'mobx';
import { lightTheme } from '~/renderer/constants';

export class Store {
  @observable
  public theme = lightTheme;

  @observable
  public visible = true;

  public id = remote.getCurrentWebContents().id;

  public constructor() {
    ipcRenderer.on('visible', (e, flag) => {
      this.visible = flag;
    });

    setTimeout(() => {
      this.visible = false;
    });

    window.addEventListener('blur', () => {
      if (this.visible) {
        setTimeout(() => {
          ipcRenderer.send(`hide-${this.id}`);
        });
      }
    });
  }
}

export default new Store();
