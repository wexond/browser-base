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

  @observable
  public x = 0;

  @observable
  public xTransition = false;

  private timeout: any;
  private timeout1: any;

  @computed
  public get domain() {
    const parsed = parse(this.url);
    if (this.url.startsWith('wexond://')) {
      return parsed.protocol + '//' + parsed.hostname;
    }

    if (parsed.protocol === 'file:') {
      return 'local or shared file';
    }

    return parsed.hostname;
  }

  public constructor() {
    ipcRenderer.on('visible', (e, flag, tab) => {
      clearTimeout(this.timeout);
      clearTimeout(this.timeout1);

      if (!flag) {
        this.visible = flag;
      }

      if (flag) {
        this.timeout1 = setTimeout(() => {
          this.xTransition = true;
        }, 80);
      } else if (!flag) {
        this.timeout = setTimeout(() => {
          this.xTransition = false;
        }, 100);
      }

      if (tab) {
        this.title = tab.title;
        this.url = tab.url;
        this.x = tab.x;

        if (flag && this.title !== '' && this.url !== '') {
          this.visible = flag;
        }
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
