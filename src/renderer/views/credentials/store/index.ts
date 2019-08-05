import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observable } from 'mobx';

import { Textfield } from '~/renderer/components/Textfield';
import { PasswordInput } from '~/renderer/components/PasswordInput';
import { IFormFillData } from '~/interfaces';
import { getCurrentWindow } from '../../app/utils/windows';

export class Store {
  @observable
  public content: 'save' | 'update' | 'list';

  @observable
  public list: IFormFillData[] = [];

  public usernameRef = React.createRef<Textfield>();

  public passwordRef = React.createRef<PasswordInput>();

  public oldUsername: string;

  public windowId: number = ipcRenderer.sendSync(
    `get-window-id-${getCurrentWindow().id}`,
  );

  public constructor() {
    ipcRenderer.on('credentials-update', (e, data) => {
      const { username, password, content, list } = data;

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

  public remove(data: IFormFillData) {
    this.list = this.list.filter(r => r._id !== data._id);
    ipcRenderer.send(`credentials-remove-${this.windowId}`, data);
  }
}

export default new Store();
