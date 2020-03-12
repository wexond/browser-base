import { observable, computed } from 'mobx';
import { ISettings, ITheme } from '~/interfaces';
import { AutoFillStore } from './autofill';
import { StartupTabsStore } from './startup-tabs';
import { getTheme } from '~/utils/themes';

export type SettingsSection =
  | 'appearance'
  | 'autofill'
  | 'address-bar'
  | 'privacy'
  | 'permissions'
  | 'startup'
  | 'language'
  | 'shortcuts'
  | 'downloads'
  | 'system';

export class Store {
  public autoFill = new AutoFillStore();
  public startupTabs = new StartupTabsStore();

  @observable
  public menuToggled = false;

  @observable
  public dialogContent: 'privacy' | 'edit-address' = null;

  @observable
  public selectedSection: SettingsSection = 'appearance';

  @observable
  public settings: ISettings = { ...(window as any).settings };

  @computed
  public get theme(): ITheme {
    return getTheme(this.settings.theme);
  }

  @computed
  public get searchEngine() {
    return this.settings.searchEngines[this.settings.searchEngine];
  }

  constructor() {
    (window as any).updateSettings = (settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    };

    window.onmousedown = () => {
      this.autoFill.menuVisible = false;
    };
  }

  public save() {
    delete this.settings.darkContents;
    delete this.settings.multrin;
    delete this.settings.shield;

    window.postMessage(
      {
        type: 'save-settings',
        data: JSON.stringify(this.settings),
      },
      '*',
    );
  }
}

export default new Store();
