import { observable } from 'mobx';

import { Page } from '@/models/app';
import store from '.';

export class PagesStore {
  @observable
  public pages: Page[] = [];

  public getById(id: number) {
    return this.pages.find(x => x.id === id);
  }

  public getSelected() {
    const tabGroup = store.tabsStore.getCurrentGroup();
    return this.getById(tabGroup.selectedTab);
  }

  public removePage(id: number) {
    (this.pages as any).replace(this.pages.filter(x => x.id !== id));
  }
}
