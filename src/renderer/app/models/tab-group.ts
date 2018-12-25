import { observable, computed } from 'mobx';

import store from '~/renderer/app/store';

let id = 0;

export class TabGroup {
  @observable
  public id: number = id++;

  @observable
  public name: string = 'New group';

  @observable
  public selectedTabId: number;

  @computed
  public get isSelected() {
    return store.tabGroupsStore.currentGroupId === this.id;
  }

  public get tabs() {
    return store.tabsStore.tabs.filter(x => x.tabGroupId === this.id);
  }

  public select() {
    store.tabGroupsStore.currentGroupId = this.id;

    setTimeout(() => {
      store.tabsStore.updateTabsBounds(false);
    }, 1);
  }
}
