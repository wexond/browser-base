import { observable, computed } from 'mobx';
import { ipcRenderer } from 'electron';

import { getDomain } from '~/utils';
import { getCurrentWindow } from '../../app/utils/windows';
import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';
import { getTheme } from '~/utils/themes';

export class Store {
  @observable
  public settings: ISettings = DEFAULT_SETTINGS;

  @computed
  public get theme() {
    return getTheme(this.settings.theme);
  }

  @observable
  public permissions: string[] = [];

  @observable
  public domain: string;

  public windowId = getCurrentWindow().id;

  public constructor() {
    ipcRenderer.on('request-permission', (e, { url, name, details }) => {
      this.domain = getDomain(url);
      this.permissions = [];

      if (name === 'notifications' || name === 'geolocation') {
        this.permissions.push(name);
      } else if (name === 'media') {
        if (details.mediaTypes.includes('audio')) {
          this.permissions.push('microphone');
        }

        if (details.mediaTypes.includes('video')) {
          this.permissions.push('camera');
        }
      }
    });

    ipcRenderer.send('get-settings');

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    });
  }
}

export default new Store();
