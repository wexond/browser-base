import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observable } from 'mobx';

import { Textfield } from '~/renderer/components/Textfield';
import { PasswordInput } from '~/renderer/components/PasswordInput';

export class Store {
  @observable
  public update = false;

  public usernameRef = React.createRef<Textfield>();

  public passwordRef = React.createRef<PasswordInput>();

  public oldUsername: string;

  constructor() {
    ipcRenderer.on(
      'credentials-update',
      (e: any, username: string, password: string, update: boolean) => {
        this.usernameRef.current.value = username;
        this.passwordRef.current.value = password;

        this.update = update;
        this.oldUsername = username;
      },
    );
  }
}

export default new Store();
