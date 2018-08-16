import { observable } from 'mobx';

export class TabGroupsStore {
  @observable
  public tabGroups: TabGroup[];

  @observable
  public currentTabGroup: number = 0;

  @observable
  public tabGroupsMenuVisible: boolean = false;
}
