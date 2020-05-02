import * as React from 'react';

import { observable } from 'mobx';
import { ipcRenderer } from 'electron';
import { DialogStore } from '~/models/dialog-store';
import { callViewMethod } from '~/utils/view';

interface IFindInfo {
  occurrences: string;
  text: string;
}

const defaultFindInfo = {
  occurrences: '0/0',
  text: '',
};

export class Store extends DialogStore {
  @observable
  public tabId = -1;

  @observable
  public tabsFindInfo = new Map<number, IFindInfo>();

  public findInputRef = React.createRef<HTMLInputElement>();

  @observable
  public findInfo = defaultFindInfo;

  public constructor() {
    super({ hideOnBlur: false });

    this.init();
  }

  public async init() {
    if (this.findInputRef && this.findInputRef.current) {
      this.findInputRef.current.focus();
    }

    ipcRenderer.on(
      'found-in-page',
      (e, { activeMatchOrdinal, matches }: Electron.FoundInPageResult) => {
        this.findInfo.occurrences = `${activeMatchOrdinal}/${matches}`;
        this.sendInfo();
      },
    );

    ipcRenderer.on('update-tab-info', (e, tabId, info) => {
      this.tabId = tabId;
      this.findInfo = info;
    });
  }

  public sendInfo() {
    this.send('update-tab-info', this.tabId, { ...this.findInfo });
  }

  public onHide() {
    callViewMethod(this.tabId, 'stopFindInPage', 'clearSelection');
    this.findInfo = defaultFindInfo;
    this.sendInfo();
    ipcRenderer.send(`window-focus-${this.windowId}`);
  }
}

export default new Store();
