import { observable } from 'mobx';
import { ipcRenderer } from 'electron';

import { getDomain } from '~/utils';
import { getCurrentWindow } from '../../app/utils/windows';

export class Store {
  @observable
  public permissions: string[] = [];

  @observable
  public domain: string;

  public windowId: number = ipcRenderer.sendSync(
    `get-window-id-${getCurrentWindow().id}`,
  );

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
