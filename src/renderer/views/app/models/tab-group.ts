import * as React from 'react';
import { observable, action } from 'mobx';

import { LIGHT_BLUE_500 } from '~/renderer/constants';
import { Store } from '../store';
import { TabGroupsStore } from '../store/tab-groups';
import { animateTab } from '../utils/tabs';

let id = 0;

export class ITabGroup {
  @observable
  public id: number = id++;

  @observable
  public name = '';

  @observable
  public color: string = LIGHT_BLUE_500;

  @observable
  public editMode = false;

  public width = 0;
  public left = 8;

  public isNew = true;

  private store: Store;
  private tabGroups: TabGroupsStore;

  public ref = React.createRef<HTMLDivElement>();
  public placeholderRef = React.createRef<HTMLDivElement>();
  public lineRef = React.createRef<HTMLDivElement>();

  public constructor(store: Store, tabGroupsStore: TabGroupsStore) {
    this.store = store;
    this.tabGroups = tabGroupsStore;

    const { palette } = tabGroupsStore;
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  public get tabs() {
    return this.store.tabs.list.filter(x => x.tabGroupId === this.id);
  }

  @action
  public setLeft(left: number, animation: boolean) {
    animateTab('translateX', left, this.ref.current, animation);
    this.left = left;
  }

  @action
  public setWidth(width: number, animation: boolean) {
    animateTab('width', width, this.lineRef.current, animation);
    this.width = width;
  }
}
