import { observable, computed } from 'mobx';
import * as React from 'react';

import { TabGroup } from '~/renderer/app/models';
import store from '.';

export class TabGroupsStore {
  @observable
  public groups: TabGroup[] = [];

  @observable
  public _currentGroupId = 0;

  @computed
  public get currentGroupId() {
    return this._currentGroupId;
  }

  public set currentGroupId(id: number) {
    this._currentGroupId = id;
    const group = this.currentGroup;
    const tab = store.tabsStore.getTabById(group.selectedTabId);

    if (tab) {
      tab.select();
      store.overlayStore.visible = false;
    }

    setTimeout(() => {
      store.tabsStore.updateTabsBounds(false);
    });
  }

  public get currentGroup() {
    return this.getGroupById(this.currentGroupId);
  }

  public removeGroup(id: number) {
    (this.groups as any).replace(this.groups.filter(x => x.id !== id));
  }

  public getGroupById(id: number) {
    return this.groups.find(x => x.id === id);
  }

  public addGroup() {
    const tabGroup: TabGroup = new TabGroup();
    this.groups.push(tabGroup);
    this.currentGroupId = tabGroup.id;
  }
}
