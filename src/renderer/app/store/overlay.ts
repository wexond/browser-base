import { observable, computed } from 'mobx';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import store from '.';
import { callBrowserViewMethod } from '~/shared/utils/browser-view';

export class OverlayStore {
  public scrollRef = React.createRef<HTMLDivElement>();
  public bsRef: HTMLDivElement;
  public inputRef = React.createRef<HTMLInputElement>();

  @observable
  private _visible = false;

  @computed
  public get visible() {
    return this._visible;
  }

  public set visible(val: boolean) {
    if (val === this._visible) return;

    if (!val) {
      setTimeout(() => {
        ipcRenderer.send('browserview-show');
      }, 200);
      store.suggestionsStore.suggestions = [];
    } else {
      this.scrollRef.current.scrollTop = 0;
      ipcRenderer.send('browserview-hide');

      callBrowserViewMethod(store.tabsStore.selectedTabId, 'getURL').then(
        (url: string) => {
          this.inputRef.current.value = url;
          this.inputRef.current.focus();
        },
      );
    }

    this._visible = val;
  }
}
