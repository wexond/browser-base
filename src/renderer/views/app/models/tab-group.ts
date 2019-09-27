import { observable, computed, action } from 'mobx';

import { colors } from '~/renderer/constants';
import { Store } from '../store';
import { TabGroupsStore } from '../store/tab-groups';

let id = 0;

export class ITabGroup {
  @observable
  public id: number = id++;

  @observable
  public name = 'New group';

  @observable
  public selectedTabId: number;

  @observable
  public color: string = colors.lightBlue['500'];

  @observable
  public editMode = false;

  private store: Store;
  private tabGroups: TabGroupsStore;

  public constructor(store: Store, tabGroupsStore: TabGroupsStore) {
    this.store = store;
    this.tabGroups = tabGroupsStore;

    const { palette } = tabGroupsStore;
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  @computed
  public get isSelected() {
    return this.tabGroups.currentGroupId === this.id;
  }

  public get tabs() {
    return this.store.tabs.list.filter(x => x.tabGroupId === this.id);
  }

  @action
  public select() {
    this.store.tabGroups.currentGroupId = this.id;

    setTimeout(() => {
      this.store.tabs.updateTabsBounds(false);
    }, 1);
  }
}
