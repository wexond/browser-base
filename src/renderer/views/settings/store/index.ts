import { observable, computed } from 'mobx';
import { DEFAULT_SETTINGS, DEFAULT_SEARCH_ENGINES } from '~/constants';
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
  public settings: ISettings = DEFAULT_SETTINGS;

  @computed
  public get theme() {
    return getTheme(this.settings.theme);
  }

  @observable
  public searchEngines: ISearchEngine[] = DEFAULT_SEARCH_ENGINES;

  @computed
  public get searchEngine() {
    return this.searchEngines[this.settings.searchEngine];
  }

  public constructor() {
    const id = makeId(32);

    window.addEventListener('message', ({ data }) => {
      if (data.type === 'result' && data.id === id) {
        this.settings = { ...this.settings, ...data.result };

        delete this.settings.darkContents;
        delete this.settings.multrin;
        delete this.settings.shield;

        this.searchEngines = DEFAULT_SEARCH_ENGINES.concat(
          data.result.searchEngines,
        );
      }
    });

    window.postMessage(
      {
        type: 'get-settings',
        id,
      },
      '*',
    );
  }

  public save() {
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
