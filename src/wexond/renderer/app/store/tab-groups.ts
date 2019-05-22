import { observable, computed, action } from 'mobx';

import { TabGroup } from '~/renderer/app/models';
import store from '.';
import { ipcRenderer, remote } from 'electron';
import { colors } from '~/renderer/constants';
import { closeWindow } from '../utils';

export class TabGroupsStore {
  @observable
  public list: TabGroup[] = [];

  @observable
  public _currentGroupId = 0;

  public palette: string[] = [];

  constructor() {
    for (const key in colors) {
      if ((colors as any)[key]['500'] && key !== 'yellow' && key !== 'lime') {
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
    const tab = store.tabs.getTabById(group.selectedTabId);

    if (tab) {
      tab.select();
      store.overlay.visible = false;
    } else {
      const { current } = store.overlay.inputRef;
      if (current) {
        store.overlay.searchBoxValue = '';
        current.focus();
      }
    }

    setTimeout(() => {
      store.tabs.updateTabsBounds(false);
    });
  }

  public get currentGroup() {
    return this.getGroupById(this.currentGroupId);
  }

  @action
  public removeGroup(id: number) {
    const group = this.getGroupById(id);
    const index = this.list.indexOf(group);

    for (const tab of group.tabs) {
      store.tabs.removeTab(tab.id);
      ipcRenderer.send('browserview-destroy', tab.id);
    }

    if (group.isSelected) {
      if (this.list.length > index + 1) {
        this.currentGroupId = this.list[index + 1].id;
      } else if (index - 1 >= 0) {
        this.currentGroupId = this.list[index - 1].id;
      } else {
        this.currentGroupId = this.list[0].id;
      }
    }

    this.list.splice(index, 1);

    if (this.list.length === 0) {
      closeWindow();
    }
  }

  public getGroupById(id: number) {
    return this.list.find(x => x.id === id);
  }

  @action
  public addGroup() {
    const tabGroup: TabGroup = new TabGroup();
    this.list.push(tabGroup);
    this.currentGroupId = tabGroup.id;

    const { current } = store.overlay.inputRef;
    if (current) {
      store.overlay.searchBoxValue = '';
      current.focus();
    }
  }
}
