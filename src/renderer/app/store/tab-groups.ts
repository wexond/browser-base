import { observable } from 'mobx';
import * as React from 'react';

import { TabGroup } from '~/renderer/app/models';
import store from '.';

export class TabGroupsStore {
  public groups: TabGroup[] = [];

  @observable
  public currentGroupId = 0;

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
    store.tabsStore.addTab();
  }
}
