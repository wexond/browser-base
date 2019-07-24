import { ipcRenderer } from 'electron';
import * as React from 'react';

import { Textfield } from '~/renderer/components/Textfield';
import { PasswordInput } from '~/renderer/components/PasswordInput';

export class Store {
  public usernameRef = React.createRef<Textfield>();

  public passwordRef = React.createRef<PasswordInput>();

  constructor() {
    ipcRenderer.on(
      'credentials-update',
      (e: any, username: string, password: string) => {
        this.usernameRef.current.value = username;
        this.passwordRef.current.value = password;
      },
    );
  }
}

export default new Store();
