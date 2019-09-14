import { observable } from 'mobx';
import { ipcRenderer } from 'electron';

import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS, DEFAULT_SEARCH_ENGINES } from '~/constants';
import { Store } from '.';
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

export class SettingsStore {
  @observable
  public selectedSection: SettingsSection = 'appearance';

  @observable
  public object: ISettings = DEFAULT_SETTINGS;

  public store: Store;

  public constructor(store: Store) {
    this.store = store;

    const obj = ipcRenderer.sendSync('get-settings-sync');
    this.updateSettings(obj);

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.updateSettings(settings);
    });
  }

  public updateSettings(newSettings: ISettings) {
    this.object = { ...this.object, ...newSettings };

    /*TODO: this.store.searchEngines = DEFAULT_SEARCH_ENGINES.concat(
      newSettings.searchEngines,
    );*/

    requestAnimationFrame(() => {
      this.store.theme = getTheme(this.object.theme);
    });
  }

  public async save() {
    ipcRenderer.send('save-settings', {
      settings: JSON.stringify(this.object),
      incognito: this.store.isIncognito,
    });
  }
}
