import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observable } from 'mobx';

import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public content: 'save' | 'update' | 'list';

  @observable
  public list: any[] = [];

  public usernameRef = React.createRef<HTMLInputElement>();

  public passwordRef = React.createRef<HTMLInputElement>();

  public oldUsername: string;

  constructor() {
    super({ hideOnBlur: true });

    ipcRenderer.on('show', e => {
      this.content = 'save';
    });

    ipcRenderer.on('data', (e, username: string, password: string) => {
      this.usernameRef.current.value = username || '';
      this.passwordRef.current.value = password || '';
    });

    // ipcRenderer.on('credentials-update', (e, data) => {
    //   const { username, password, content, list } = data;

    //   if (content !== 'list') {
    //     this.usernameRef.current.value = username;
    //     this.passwordRef.current.value = password;
    //     this.oldUsername = username;
    //   } else {
    //     this.list = list;
    //   }

    //   this.content = content;
    // });
  }

  public remove(data: any) {
    this.list = this.list.filter(r => r._id !== data._id);
    ipcRenderer.send(`credentials-remove-${this.windowId}`, data);
  }
}

export default new Store();
