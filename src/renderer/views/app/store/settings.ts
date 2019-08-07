import { observable } from 'mobx';
import { ipcRenderer } from 'electron';

import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';
import { darkTheme, lightTheme } from '~/renderer/constants';
import { Store } from '.';

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

    const obj = ipcRenderer.sendSync('get-settings');
    this.updateSettings(obj);

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.updateSettings(settings);
    });
  }

  public updateSettings(newSettings: ISettings) {
    this.object = { ...this.object, ...newSettings };

    requestAnimationFrame(() => {
      this.store.theme = this.object.darkTheme ? darkTheme : lightTheme;
    });
  }

  public async save() {
    ipcRenderer.send('save-settings', {
      settings: JSON.stringify(this.object),
      incognito: this.store.isIncognito,
    });
  }
}
