import { observable, computed } from 'mobx';
import * as React from 'react';

import { TabGroup } from '~/renderer/app/models';
import store from '.';
import { ipcRenderer } from 'electron';
import { colors } from '~/renderer/constants';
import { closeWindow } from '../utils';

export class TabGroupsStore {
  @observable
  public groups: TabGroup[] = [];

  @observable
  public _currentGroupId = 0;

  public palette: string[] = [];

  constructor() {
    for (const key in colors) {
      if ((colors as any)[key]['500'] && key !== 'yellow') {
        this.palette.push((colors as any)[key]['500']);
      }
    }
  }

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
    } else {
      const { current } = store.overlayStore.inputRef;
      if (current) {
        current.value = '';
        current.focus();
      }
    }

    setTimeout(() => {
      store.tabsStore.updateTabsBounds(false);
    });
  }

  public get currentGroup() {
    return this.getGroupById(this.currentGroupId);
  }

  public removeGroup(id: number) {
    const group = this.getGroupById(id);
    const index = this.groups.indexOf(group);

    for (const tab of group.tabs) {
      store.tabsStore.removeTab(tab.id);
      ipcRenderer.send('browserview-destroy', tab.id);
    }

    if (group.isSelected) {
      if (this.groups.length - 1 > index + 1) {
        this.currentGroupId = this.groups[index + 1].id;
      } else if (index - 1 >= 0) {
        this.currentGroupId = this.groups[index - 1].id;
      }
    }

    this.groups.splice(index, 1);

    if (this.groups.length === 0) {
      closeWindow();
    }
  }

  public getGroupById(id: number) {
    return this.groups.find(x => x.id === id);
  }

  public addGroup() {
    const tabGroup: TabGroup = new TabGroup();
    this.groups.push(tabGroup);
    this.currentGroupId = tabGroup.id;

    const { current } = store.overlayStore.inputRef;
    if (current) {
      current.value = '';
      current.focus();
    }
  }
}
