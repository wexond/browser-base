import * as React from 'react';
import { observable, action, makeObservable } from 'mobx';

import { LIGHT_BLUE_500 } from '~/renderer/constants';
import { Store } from '../store';
import { TabGroupsStore } from '../store/tab-groups';
import { animateTab } from '../utils/tabs';

let id = 0;

export class ITabGroup {
  public width = 0;
  public left = 8;

  public isNew = true;

  private store: Store;
  private tabGroups: TabGroupsStore;

  public ref = React.createRef<HTMLDivElement>();
  public placeholderRef = React.createRef<HTMLDivElement>();
  public lineRef = React.createRef<HTMLDivElement>();

  // Observable
  public id: number = id++;

  public name = '';

  public color: string = LIGHT_BLUE_500;

  public editMode = false;

  public constructor(store: Store, tabGroupsStore: TabGroupsStore) {
    makeObservable(this, {
      id: observable,
      name: observable,
      color: observable,
      editMode: observable,
      setLeft: action,
      setWidth: action,
    });

    this.store = store;
    this.tabGroups = tabGroupsStore;

    const { palette } = tabGroupsStore;
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  public get tabs() {
    return this.store.tabs.list.filter((x) => x.tabGroupId === this.id);
  }

  public setLeft(left: number, animation: boolean) {
    animateTab('translateX', left, this.ref.current, animation);
    this.left = left;
  }

  public setWidth(width: number, animation: boolean) {
    animateTab('width', width, this.lineRef.current, animation);
    this.width = width;
  }
}
