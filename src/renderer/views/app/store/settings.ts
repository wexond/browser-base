import { observable } from 'mobx';
import { ipcRenderer } from 'electron';
import { writeFile, readFileSync } from 'fs';

import { ISettings } from '~/interfaces';
import { getPath } from '~/utils';
import { darkTheme, lightTheme } from '~/renderer/constants';
import store, { Store } from '.';

export type SettingsSection =
  | 'appearance'
  | 'autofill'
  | 'search-engine'
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
  public object: ISettings = {
    darkTheme: false,
    shield: true,
    multrin: true,
    animations: true,
  };

  constructor(private store: Store) {}

  public save() {
    ipcRenderer.send('settings', this.object);

    writeFile(getPath('settings.json'), JSON.stringify(this.object), err => {
      if (err) console.error(err);
    });
  }

  public load() {
    this.object = {
      ...this.object,
      ...JSON.parse(readFileSync(getPath('settings.json'), 'utf8')),
    };

    this.store.theme = this.object.darkTheme ? darkTheme : lightTheme;

    ipcRenderer.send('settings', this.object);
  }
}
