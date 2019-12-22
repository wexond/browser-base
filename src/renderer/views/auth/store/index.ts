import { observable, computed } from 'mobx';
import { ipcRenderer, remote } from 'electron';
import { DEFAULT_SETTINGS } from '~/constants';
import { ISettings } from '~/interfaces';
import { getTheme } from '~/utils/themes';

export class Store {
  @observable
  public settings: ISettings = DEFAULT_SETTINGS;

  @computed
  public get theme() {
    return getTheme(this.settings.theme);
  }

  @observable
  public url: string;

  public windowId: number = remote.getCurrentWindow().id;

  public constructor() {
    ipcRenderer.on('request-auth', (e, url) => {
      this.url = url;
    });

    ipcRenderer.send('get-settings');

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    });
  }
}

export default new Store();
