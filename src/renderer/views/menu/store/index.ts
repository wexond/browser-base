import { ipcRenderer } from 'electron';
import { getCurrentWindow } from '../../app/utils/windows';
import { observable } from 'mobx';
import { lightTheme } from '~/renderer/constants';

export class Store {
  public windowId: number = ipcRenderer.sendSync(
    `get-window-id-${getCurrentWindow().id}`,
  );

  @observable
  public theme = lightTheme;

  public constructor() {}
}

export default new Store();
