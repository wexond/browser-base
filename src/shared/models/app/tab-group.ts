import { observable, computed } from 'mobx';

import store from '@app/store';
import { Tab, Page } from '.';
import { defaultAddTabOptions } from '@/constants/app';

let id = 0;

export class TabGroup {
  @observable
  public id: number = id++;

  @observable
  public tabs: Tab[] = [];

  @observable
  public name: string = 'New group';

  @observable
  public selectedTab: number;

  @observable
  public inputVisible: boolean = false;

  @computed
  public get isSelected() {
    return store.tabsStore.currentGroup === this.id;
  }

  public select() {
    store.tabsStore.currentGroup = this.id;

    setTimeout(() => {
      this.updateTabsBounds(false);
    }, 1);
  }

  public addTab({ url, active } = defaultAddTabOptions) {
    const tab = new Tab(this);
    tab.url = url;
    this.tabs.push(tab);

    const page = new Page(tab.id, url);
    store.pagesStore.pages.push(page);

    if (active) {
      tab.select();
    }

    return tab;
  }

  public removeTab(id: number) {
    (this.tabs as any).replace(this.tabs.filter(x => x.id !== id));
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
    const tabbarWidth = store.tabsStore.getContainerWidth();

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
        const tab = this.tabs[i];
        if (callingTab.left <= tab.width / 2 + tab.left) {
          this.replaceTab(this.tabs[i + 1], tab);
        } else {
          break;
        }
      }
    } else if (direction === 'right') {
      for (let i = index + 1; i < this.tabs.length; i++) {
        const tab = this.tabs[i];
        if (callingTab.left + callingTab.width >= tab.width / 2 + tab.left) {
          this.replaceTab(this.tabs[i - 1], tab);
        } else {
          break;
        }
      }
    }
  }

  public getTabById(id: number) {
    return this.tabs.find(x => x.id === id);
  }
}
