import { observable, computed, makeObservable } from 'mobx';
import * as React from 'react';
import { ISettings, ITheme, ISearchEngine } from '~/interfaces';
import { AutoFillStore } from './autofill';
import { StartupTabsStore } from './startup-tabs';
import { getTheme } from '~/utils/themes';
import { Textfield } from '~/renderer/components/Textfield';

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
  | 'system'
  | 'search-engines';

export class Store {
  public autoFill = new AutoFillStore();
  public startupTabs = new StartupTabsStore();

  public menuRef = React.createRef<HTMLDivElement>();

  public dialogRef = React.createRef<HTMLDivElement>();

  public searchEngineInputRef = React.createRef<Textfield>();
  public searchEngineKeywordInputRef = React.createRef<Textfield>();
  public searchEngineUrlInputRef = React.createRef<Textfield>();

  @observable
  public menuInfo = {
    left: 0,
    top: 0,
  };

  @observable
  private _menuVisible = false;

  @computed
  public get menuVisible() {
    return this._menuVisible;
  }

  public set menuVisible(value: boolean) {
    this._menuVisible = value;

    if (value) {
      this.menuRef.current.focus();
    }
  }

  @observable
  public dialogVisible = false;

  @observable
  public dialogContent:
    | 'edit-search-engine'
    | 'add-search-engine'
    | 'edit-address'
    | 'edit-password'
    | 'privacy' = null;

  @observable
  public selectedSection: SettingsSection = 'appearance';

  @observable
  public settings: ISettings = { ...(window as any).settings };

  @observable
  public editedSearchEngine: ISearchEngine = null;

  @computed
  public get theme(): ITheme {
    return getTheme(this.settings.theme);
  }

  @computed
  public get searchEngine() {
    return this.settings.searchEngines[this.settings.searchEngine];
  }

  constructor() {
    makeObservable(this);

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
