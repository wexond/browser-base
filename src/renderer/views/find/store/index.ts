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
    const { occurrences, text, tabId } = await this.invoke('fetch');

    this.findInfo = {
      occurrences,
      text,
    };
    this.tabId = tabId;

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

    ipcRenderer.on('visibility-changed', (e, flag, tabId, findInfo) => {
      if (flag) {
        this.findInfo = findInfo;
        this.tabId = tabId;
      } else {
        this.sendInfo();
      }
    });
  }

  public sendInfo() {
    this.send('set-find-info', this.tabId, { ...this.findInfo });
  }

  public onHide() {
    callViewMethod(this.tabId, 'stopFindInPage', 'clearSelection');
    this.findInfo = defaultFindInfo;
    this.sendInfo();
    ipcRenderer.send(`window-focus-${this.windowId}`);
  }
}

export default new Store();
