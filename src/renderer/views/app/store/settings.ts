import { observable } from 'mobx';
import { ipcRenderer } from 'electron';
import { writeFile, readFileSync } from 'fs';

import { ISettings } from '~/interfaces';
import { getPath } from '~/utils';
import { darkTheme, lightTheme } from '~/renderer/constants';
import store from '.';

export type SettingsSection =
  | 'general'
  | 'appearance'
  | 'autofill'
  | 'search-engine'
  | 'startup'
  | 'language'
  | 'weather'
  | 'shortcuts'
  | 'downloads';

export class SettingsStore {
  @observable
  public selectedSection: SettingsSection = 'general';

  @observable
  public object: ISettings = {
    dialType: 'top-sites',
    isDarkTheme: false,
    isShieldToggled: true,
    isMultrinToggled: true,
  };

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

    store.theme = this.object.isDarkTheme ? darkTheme : lightTheme;

    ipcRenderer.send('settings', this.object);
  }
}
