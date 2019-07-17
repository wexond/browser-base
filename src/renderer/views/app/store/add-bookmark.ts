import * as React from 'react';
import { observable } from 'mobx';
import store from '.';

export class AddBookmarkStore {
  @observable
  public visible = false;

  public titleRef = React.createRef<HTMLInputElement>();

  constructor() {
    requestAnimationFrame(() => {
      window.removeEventListener('mousedown', this.onWindowMouseDown);
      window.addEventListener('mousedown', this.onWindowMouseDown);
    })
  }

  public show() {
    this.visible = true;
    this.titleRef.current.value = store.overlay.bookmark.title;
  }

  public hide() {
    this.visible = false;
  }

  public onWindowMouseDown = () => {
    this.visible = false;
  }
}
