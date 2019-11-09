import { ipcRenderer, remote } from 'electron';
import { observable, computed } from 'mobx';
import { getTheme } from '~/utils/themes';
import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';
import { parse } from 'url';

export class Store {
  @observable
  public settings: ISettings = DEFAULT_SETTINGS;

  @computed
  public get theme() {
    return getTheme(this.settings.theme);
  }

  @observable
  public visible = false;

  @observable
  public id = remote.getCurrentWebContents().id;

  @observable
  public windowId = remote.getCurrentWindow().id;

  @observable
  public title = '';

  @observable
  public url = '';

  @computed
  public get domain() {
    return parse(this.url).hostname;
  }

  public constructor() {
    ipcRenderer.on('visible', (e, flag, tab) => {
      this.visible = flag;
      if (tab) {
        this.title = tab.title;
        this.url = tab.url;
      }
    });

    ipcRenderer.send('get-settings');

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    });
  }

  public hide() {
    ipcRenderer.send(`hide-${this.id}`);
  }
}

export default new Store();
