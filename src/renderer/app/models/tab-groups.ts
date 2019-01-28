import { TabGroup } from '.';

export class TabGroups {
  public list: TabGroup[] = [];

  public currentGroupId = 0;

  public addTabGroup() {
    const tabGroup = new TabGroup();
    this.list.push(tabGroup);
  }

  public get currentGroup() {
    return this.list.find(x => x.id === this.currentGroupId);
  }
}
