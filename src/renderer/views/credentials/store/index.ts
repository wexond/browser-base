import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observable } from 'mobx';

import { Textfield } from '~/renderer/components/Textfield';
import { PasswordInput } from '~/renderer/components/PasswordInput';
import { IFormFillData } from '~/interfaces';

export class Store {
  @observable
  public content: 'save' | 'update' | 'list';

  @observable
  public list: IFormFillData[] = [];

  public usernameRef = React.createRef<Textfield>();

  public passwordRef = React.createRef<PasswordInput>();

  public oldUsername: string;

  public constructor() {
    ipcRenderer.on('credentials-update', (e, data) => {
      const { username, password, content, list } = data;

      console.log(data);

      if (content !== 'list') {
        this.usernameRef.current.value = username;
        this.passwordRef.current.value = password;
        this.oldUsername = username;
      } else {
        this.list = list;
      }

      this.content = content;
    });
  }

  public remove(id: string) {
    this.list = this.list.filter(r => r._id !== id);
    ipcRenderer.send('credentials-remove', id);
  }
}

export default new Store();
