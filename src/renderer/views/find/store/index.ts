import * as React from 'react';

import { observable } from 'mobx';
import { ipcRenderer } from 'electron';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public occurrences = '0/0';

  @observable
  public text = '';

  public tabId: number;

  public findInputRef = React.createRef<HTMLInputElement>();

  public constructor() {
    super({ hideOnBlur: false, visibilityWrapper: false });

    ipcRenderer.on('visible', (e, flag) => {
      this.visible = flag;
    });

    ipcRenderer.on(
      'found-in-page',
      (e, { activeMatchOrdinal, matches }: Electron.FoundInPageResult) => {
        this.occurrences = `${activeMatchOrdinal}/${matches}`;
        this.updateTabInfo();
      },
    );

    ipcRenderer.on(
      'update-info',
      (e, tabId: number, { text, occurrences, visible }) => {
        this.tabId = tabId;
        this.occurrences = occurrences;
        this.text = text;
        this.visible = visible;

        setTimeout(() => {
          this.findInputRef.current.focus();
        });

        if (!visible) {
          this.hide();
        } else {
          ipcRenderer.send(`show-${this.id}`);
        }

        this.updateTabInfo();
      },
    );
  }

  public updateTabInfo() {
    ipcRenderer.send(`update-tab-find-info-${this.windowId}`, this.tabId, {
      occurrences: this.occurrences,
      text: this.text,
      visible: this.visible,
    });
  }
}

export default new Store();
