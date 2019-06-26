import * as React from 'react';

import { observable } from 'mobx';
import { ipcRenderer } from 'electron';

export class Store {
  public tabId: number;

  public findInputRef = React.createRef<HTMLInputElement>();

  @observable
  public occurrences: string = '0/0';

  @observable
  public text: string = '';

  constructor() {
    ipcRenderer.on(
      'found-in-page',
      (e: any, { activeMatchOrdinal, matches }: Electron.FoundInPageResult) => {
        this.occurrences = `${activeMatchOrdinal}/${matches}`;
      },
    );

    ipcRenderer.on(
      'show',
      (e: any, tabId: number, { text, occurrences }: any) => {
        this.tabId = tabId;
        this.occurrences = occurrences;
        this.text = text;
      },
    );
  }

  updateTabInfo() {
    ipcRenderer.send('update-tab-find-info', this.tabId, {
      occurences: this.occurrences,
      text: this.text,
    });
  }
}

export default new Store();
