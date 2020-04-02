import * as React from 'react';

import { observable, computed } from 'mobx';
import { ipcRenderer } from 'electron';
import { DialogStore } from '~/models/dialog-store';
import { callViewMethod } from '~/utils/view';

interface IFindInfo {
  occurrences: string;
  text: string;
}

export class Store extends DialogStore {
  @observable
  public tabId = -1;

  @observable
  public tabsFindInfo = new Map<number, IFindInfo>();

  public findInputRef = React.createRef<HTMLInputElement>();

  @computed
  public get findInfo() {
    const findInfo = this.tabsFindInfo.get(this.tabId);

    if (findInfo) {
      return findInfo;
    }

    return {
      occurrences: '0/0',
      text: '',
    };
  }

  public constructor() {
    super({ hideOnBlur: false, visibilityWrapper: false });

    ipcRenderer.on('visible', (e, flag, tabId) => {
      this.visible = flag;

      if (flag && tabId) {
        if (!this.tabsFindInfo.get(tabId)) {
          this.tabsFindInfo.set(tabId, {
            occurrences: '0/0',
            text: '',
          });
        }
        this.tabId = tabId;
      }
    });

    ipcRenderer.on(
      'found-in-page',
      (e, { activeMatchOrdinal, matches }: Electron.FoundInPageResult) => {
        this.findInfo.occurrences = `${activeMatchOrdinal}/${matches}`;
      },
    );
  }

  public onHide() {
    callViewMethod(this.tabId, 'stopFindInPage', 'clearSelection');
    this.tabsFindInfo.delete(this.tabId);
    ipcRenderer.send(`window-focus-${this.windowId}`);
  }
}

export default new Store();
