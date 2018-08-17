import { observable } from 'mobx';
import { Tab, Page } from '.';
import store from '../store';
import { defaultCreateTabProperties } from '../defaults/create-tab-properties';

export class TabGroup {
  @observable
  public id: number;

  @observable
  public tabs: Tab[] = [];

  @observable
  public name: string;

  @observable
  public selectedTab: number;

  public addTab({ url, active } = defaultCreateTabProperties) {
    const tabGroup = store.tabGroupsStore.getCurrent();
    const tab = new Tab(tabGroup);
    tabGroup.tabs.push(tab);

    const page = new Page(tab.id, url);
    store.pagesStore.pages.push(page);

    if (active) {
      tab.select();
    }

    return tab;
  }

  public getSelectedTab() {
    return this.tabs.find(x => x.id === this.selectedTab);
  }
}
