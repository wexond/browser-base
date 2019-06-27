import { observable, computed, action } from 'mobx';

import store from '~/renderer/app/store';
import { colors } from '~/renderer/constants';

let id = 0;

export class TabGroup {
  @observable
  public id: number = id++;

  @observable
  public name: string = 'New group';

  @observable
  public selectedTabId: number;

  @observable
  public color: string = colors.lightBlue['500'];

  @observable
  public editMode = false;

  constructor() {
    const { palette } = store.tabGroups;
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  @computed
  public get isSelected() {
    return store.tabGroups.currentGroupId === this.id;
  }

  public get tabs() {
    return store.tabs.list.filter(x => x.tabGroupId === this.id);
  }

  @action
  public select() {
    store.tabGroups.currentGroupId = this.id;

    setTimeout(() => {
      store.tabs.updateTabsBounds(false);
    }, 1);
  }
}
