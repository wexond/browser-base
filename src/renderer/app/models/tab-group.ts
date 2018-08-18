import { observable } from 'mobx';
import { Tab, Page } from '.';
import store from '../store';
import { defaultCreateTabProperties } from '../../../defaults/create-tab-properties';

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
    const tab = new Tab(this);
    this.tabs.push(tab);

    const page = new Page(tab.id, url);
    store.pagesStore.pages.push(page);

    if (active) {
      tab.select();
    }

    return tab;
  }

  public removeTab(id: number) {
    this.tabs = this.tabs.filter(x => x.id !== id);
  }

  public getSelectedTab() {
    return this.tabs.find(x => x.id === this.selectedTab);
  }

  public updateTabsBounds(animation: boolean) {
    this.setTabsWidths(animation);
    this.setTabsLefts(animation);
  }

  public setTabsWidths(animation: boolean) {
    const tabs = this.tabs.filter(x => !x.isClosing);

    for (const tab of tabs) {
      tab.setWidth(tab.getWidth(), animation);
    }
  }

  public setTabsLefts(animation: boolean) {
    const tabs = this.tabs.filter(x => !x.isClosing);
    const tabbarWidth = store.tabbarStore.getWidth();

    let left = 0;

    for (const tab of tabs) {
      tab.setLeft(left, animation);
      left += tab.width + 2;
    }

    store.addTabStore.setLeft(Math.min(left, tabbarWidth), animation);
  }

  public replaceTab(firstTab: Tab, secondTab: Tab) {
    const tabsCopy = this.tabs.slice();

    const firstIndex = tabsCopy.indexOf(firstTab);
    const secondIndex = tabsCopy.indexOf(secondTab);

    tabsCopy[firstIndex] = secondTab;
    tabsCopy[secondIndex] = firstTab;

    secondTab.setLeft(firstTab.getLeft(), true);
    (this.tabs as any).replace(tabsCopy);
  }

  public getTabsToReplace(callingTab: Tab, direction: string) {
    const index = this.tabs.indexOf(callingTab);

    if (direction === 'left') {
      for (let i = index; i--;) {
        if (callingTab.left <= this.tabs[i].width / 2 + this.tabs[i].left) {
          this.replaceTab(this.tabs[i + 1], this.tabs[i]);
        }
      }
    } else if (direction === 'right') {
      for (let i = index + 1; i < this.tabs.length; i++) {
        if (
          callingTab.left + callingTab.width >=
          this.tabs[i].width / 2 + this.tabs[i].left
        ) {
          this.replaceTab(this.tabs[i - 1], this.tabs[i]);
        }
      }
    }
  }

  public getTabById(id: number) {
    return this.tabs.find(x => x.id === id);
  }
}
