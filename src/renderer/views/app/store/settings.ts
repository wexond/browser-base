import { observable, action, computed } from 'mobx';
import { ipcRenderer } from 'electron';

import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';
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

    let firstTime = false;

    ipcRenderer.send('get-settings');

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.updateSettings(settings);

      if (!firstTime) {
        store.startupTabs.load();
        firstTime = true;
      }
    });
  }

  @computed
  public get searchEngine() {
    return this.object.searchEngines[this.object.searchEngine];
  }

  @action
  public updateSettings(newSettings: ISettings) {
    const prevState = { ...this.object };
    this.object = { ...this.object, ...newSettings };

    if (prevState.topBarVariant !== newSettings.topBarVariant) {
      requestAnimationFrame(() => {
        this.store.tabs.updateTabsBounds(true);
      });
    }
  }

  public async save() {
    ipcRenderer.send('save-settings', {
      settings: JSON.stringify(this.object),
    });
  }
}
