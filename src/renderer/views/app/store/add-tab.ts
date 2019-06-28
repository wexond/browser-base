import * as React from 'react';

import store from '~/renderer/app/store';

export class AddTabStore {
  public left = 0;

  public ref: HTMLDivElement;

  public setLeft(left: number, animation: boolean) {
    store.tabs.animateProperty('x', this.ref, left, animation);
    this.left = left;
  }
}
