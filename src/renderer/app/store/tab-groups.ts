import { observable } from 'mobx';

import { TabGroup } from '../models';

export class TabGroupsStore {
  @observable
  public tabGroups: TabGroup[];

  @observable
  public current: number = 0;

  @observable
  public menuVisible: boolean = false;

  public getById(id: number) {
    return this.tabGroups.find(x => x.id === id);
  }

  public getCurrent() {
    return this.getById(this.current);
  }

  public getSelectedTab() {
    return this.getCurrent().getSelectedTab();
  }
}
