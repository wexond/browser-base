import { ipcRenderer, remote } from 'electron';
import { observable } from 'mobx';
import { lightTheme } from '~/renderer/constants';

export class Store {
  @observable
  public theme = lightTheme;

  @observable
  public visible = true;

  public id = remote.getCurrentWebContents().id;

  public tabId = 1;

  public constructor() {
    ipcRenderer.on('visible', (e, flag, tabId) => {
      this.visible = flag;
      this.tabId = tabId;
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
