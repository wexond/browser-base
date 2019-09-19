import * as React from 'react';
import { observable } from 'mobx';
import store from '.';
import { Dropdown } from '~/renderer/components/Dropdown';

export class AddBookmarkStore {
  @observable
  public visible = false;

  public titleRef = React.createRef<HTMLInputElement>();

  public dropdownRef = React.createRef<Dropdown>();

  public constructor() {
    requestAnimationFrame(() => {
      window.removeEventListener('mousedown', this.onWindowMouseDown);
      window.addEventListener('mousedown', this.onWindowMouseDown);
    });
  }

  public show() {
    // TODO(xnerhu): bookmarks dialog
    /*const bookmark = store.overlay.bookmark;

    this.titleRef.current.value = bookmark.title;
    this.dropdownRef.current.setValue(bookmark.parent, false);
    this.visible = true;*/
  }

  public hide() {
    this.visible = false;
  }

  public onWindowMouseDown = () => {
    this.visible = false;
  };
}
