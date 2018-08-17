import { observable } from 'mobx';

import { TabGroup } from '../models';

export class TabGroupsStore {
  @observable
  public tabGroups: TabGroup[];

  @observable
  public currentTabGroup: number = 0;

  @observable
  public menuVisible: boolean = false;
}
