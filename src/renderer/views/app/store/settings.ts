import { observable } from 'mobx';
import { ipcRenderer } from 'electron';

import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';
import { darkTheme, lightTheme } from '~/renderer/constants';
import store from '.';

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

  constructor() {
    ipcRenderer.on('get-settings', (e, settings: ISettings) => {
      this.object = { ...this.object, ...settings };
      store.theme = this.object.darkTheme ? darkTheme : lightTheme;
    });

    ipcRenderer.send('get-settings');
  }

  public async save() {
    ipcRenderer.send('save-settings', JSON.stringify(this.object));
  }
}
