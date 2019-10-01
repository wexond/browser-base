import { observable, computed } from 'mobx';
import { DEFAULT_SEARCH_ENGINES } from '~/constants';
import { ISettings, ITheme, ISearchEngine } from '~/interfaces';
import { AutoFillStore } from './autofill';
import { StartupTabsStore } from './startup-tabs';
import { makeId } from '~/utils/string';
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
  public settings: ISettings = (window as any).settings;

  @computed
  public get theme(): ITheme {
    return getTheme(this.settings.theme);
  }

  @observable
  public searchEngines: ISearchEngine[] = DEFAULT_SEARCH_ENGINES;

  @computed
  public get searchEngine() {
    return this.searchEngines[this.settings.searchEngine];
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
