import { makeObservable, observable } from 'mobx';
import { ipcRenderer } from 'electron';

import { getDomain } from '~/utils';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  public permissions: string[] = [];

  public domain = '';

  public constructor() {
    super({ hideOnBlur: false });

    makeObservable(this, { permissions: observable, domain: observable });

    ipcRenderer.on('update-tab-info', (e, tabId, { url, name, details }) => {
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
