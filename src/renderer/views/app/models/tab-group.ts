import { observable, computed, action } from 'mobx';

import { LIGHT_BLUE_500 } from '~/renderer/constants';
import { Store } from '../store';
import { TabGroupsStore } from '../store/tab-groups';

let id = 0;

export class ITabGroup {
  @observable
  public id: number = id++;

  @observable
  public name = 'New group';

  @observable
  public color: string = LIGHT_BLUE_500;

  @observable
  public editMode = false;

  @observable
  public left = 8;

  private store: Store;
  private tabGroups: TabGroupsStore;

  public constructor(store: Store, tabGroupsStore: TabGroupsStore) {
    this.store = store;
    this.tabGroups = tabGroupsStore;

    const { palette } = tabGroupsStore;
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  public get tabs() {
    return this.store.tabs.list.filter(x => x.tabGroupId === this.id);
  }
}
