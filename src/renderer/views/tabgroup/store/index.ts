import { ipcRenderer } from 'electron';
import * as React from 'react';
import { Textfield } from '~/renderer/components/Textfield';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  public inputRef = React.createRef<Textfield>();

  public tabGroupId: number;

  public constructor() {
    super();

    ipcRenderer.on('visible', (e, flag, tabGroup) => {
      this.visible = flag;

      if (flag) {
        this.tabGroupId = tabGroup.id;
        this.inputRef.current.inputRef.current.focus();
        this.inputRef.current.inputRef.current.value = tabGroup.name;
        this.inputRef.current.inputRef.current.select();
      }
    });
  }
}

export default new Store();
