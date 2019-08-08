import { observable } from 'mobx';
import { DEFAULT_SETTINGS } from '~/constants';
import { ISettings, ITheme } from '~/interfaces';
import { lightTheme } from '~/renderer/constants';
import { AutoFillStore } from './autofill';

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

  @observable
  public dialogContent: 'privacy' | 'edit-address' = null;

  @observable
  public selectedSection: SettingsSection = 'appearance';

  @observable
  public settings: ISettings = DEFAULT_SETTINGS;

  @observable
  public theme: ITheme = lightTheme;

  public constructor() {
    // TODO(sentialx): settings loading
  }

  public save() {
    window.postMessage(
      {
        name: 'save-settings',
        data: JSON.stringify(this.settings),
      },
      '*',
    );
  }
}

export default new Store();
