import { ipcRenderer } from 'electron';
import { getCurrentWindow } from '../../app/utils/windows';
import { observable } from 'mobx';
import { lightTheme } from '~/renderer/constants';

export class Store {
  @observable
  public theme = lightTheme;

  public constructor() {}
}

export default new Store();
