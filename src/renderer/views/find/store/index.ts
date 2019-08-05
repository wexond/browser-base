import * as React from 'react';

import { observable } from 'mobx';
import { ipcRenderer, remote } from 'electron';
import { getCurrentWindow } from '../../app/utils/windows';

export class Store {
  @observable
  public occurrences: string = '0/0';

  @observable
  public text: string = '';

  public tabId: number;

  public findInputRef = React.createRef<HTMLInputElement>();

  public visible = false;

  public windowId: number = ipcRenderer.sendSync(
    `get-window-id-${getCurrentWindow().id}`,
  );

  public constructor() {
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

        if (visible) {
          remote.getCurrentWindow().show();
        } else {
          remote.getCurrentWindow().hide();
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
