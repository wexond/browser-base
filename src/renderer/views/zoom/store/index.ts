import { ipcRenderer } from 'electron';
import { observable } from 'mobx';
import { IBookmark } from '~/interfaces';
import * as React from 'react';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  public zoomFactor = 1;

  public constructor() {
    super();
  }

  public async onVisibilityChange(visible: boolean) {
    this.visible = visible;
  }
}

export default new Store();
