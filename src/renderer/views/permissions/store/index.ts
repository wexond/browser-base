import { observable } from 'mobx';
import { ipcRenderer } from 'electron';

import { getDomain } from '~/utils';
import { getCurrentWindow } from '../../app/utils/windows';

export class Store {
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
  }
}

export default new Store();
