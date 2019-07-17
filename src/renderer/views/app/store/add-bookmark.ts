import * as React from 'react';
import { observable } from 'mobx';
import store from '.';
import { Dropdown } from '~/renderer/components/Dropdown';

export class AddBookmarkStore {
  @observable
  public visible = false;

  public titleRef = React.createRef<HTMLInputElement>();

  public dropdownRef = React.createRef<Dropdown>();

  constructor() {
    requestAnimationFrame(() => {
      window.removeEventListener('mousedown', this.onWindowMouseDown);
      window.addEventListener('mousedown', this.onWindowMouseDown);
    })
  }

  public show() {
    const bookmark = store.overlay.bookmark;

    this.titleRef.current.value = bookmark.title;
    this.dropdownRef.current.value = bookmark.parent;
    this.visible = true;
  }

  public hide() {
    this.visible = false;
  }

  public onWindowMouseDown = () => {
    this.visible = false;
  }
}
