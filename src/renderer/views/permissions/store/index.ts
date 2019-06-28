import { observable } from 'mobx';
import { ipcRenderer } from 'electron';

import { getDomain } from '~/utils';

export class Store {
  @observable
  public permissions: string[] = [];

  @observable
  public domain: string;

  constructor() {
    ipcRenderer.on(
      'request-permission',
      (e: any, { url, name, details }: any) => {
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
      },
    );
  }
}

export default new Store();
