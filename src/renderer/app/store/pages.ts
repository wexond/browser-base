import { observable } from 'mobx';
import { Page } from '../models/page';
import store from '.';

export class PagesStore {
  @observable
  public pages: Page[] = [];

  public getById(id: number) {
    return this.pages.find(x => x.id === id);
  }

  public getSelected() {
    const tabGroup = store.tabGroupsStore.getCurrent();
    return this.getById(tabGroup.selectedTab);
  }
}
