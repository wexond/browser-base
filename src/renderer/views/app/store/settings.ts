import { observable, action, computed, makeObservable } from 'mobx';
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
  public selectedSection: SettingsSection = 'appearance';

  public object: ISettings = DEFAULT_SETTINGS;

  public store: Store;

  public constructor(store: Store) {
    makeObservable(this, {
      selectedSection: observable,
      object: observable,
      searchEngine: computed,
      updateSettings: action,
    });

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

  public get searchEngine() {
    return this.object.searchEngines[this.object.searchEngine];
  }

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
