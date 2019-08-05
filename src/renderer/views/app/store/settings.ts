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

  constructor(public store: Store) {
    const obj = ipcRenderer.sendSync('get-settings');
    this.object = { ...this.object, ...obj };
    store.theme = this.object.darkTheme ? darkTheme : lightTheme;
  }

  public async save() {
    ipcRenderer.send('save-settings', {
      settings: JSON.stringify(this.object),
      incognito: this.store.isIncognito,
    });
  }
}
