import { observable, computed } from 'mobx';
import { Overlay } from '../components/Overlay';
import * as React from 'react';
import { ipcRenderer } from 'electron';

export class OverlayStore {
  public ref = React.createRef<Overlay>();
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
    } else {
      this.scrollRef.current.scrollTop = 0;
      ipcRenderer.send('browserview-hide');
      this.inputRef.current.focus();
    }

    this._visible = val;
  }
}
