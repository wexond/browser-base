import { observable, computed } from 'mobx';

import store from '~/renderer/app/store';
import { Tab } from '.';
import { defaultTabOptions, TABS_PADDING } from '~/renderer/app/constants/tabs';

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

  public addTab(options = defaultTabOptions) {
    const tab = new Tab(this, options);
    this.tabs.push(tab);

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

    const scrollLeft = store.tabsStore.containerRef.current.scrollLeft;
    const containerWidth = store.tabsStore.getContainerWidth();

    for (const tab of tabs) {
      const width = tab.getWidth(containerWidth, tabs);
      if (
        tab.left + tab.width > scrollLeft &&
        tab.left < containerWidth + scrollLeft + 32 &&
        tab.width !== width
      ) {
        tab.setWidth(width, animation);
      } else {
        tab.setWidth(width, false);
      }
    }
  }

  public setTabsLefts(animation: boolean) {
    const tabs = this.tabs.filter(x => !x.isClosing);

    const containerWidth = store.tabsStore.getContainerWidth();
    const scrollLeft = store.tabsStore.containerRef.current.scrollLeft;

    let left = 0;

    for (const tab of tabs) {
      if (
        tab.left + tab.width > scrollLeft &&
        tab.left < containerWidth + scrollLeft + 32 &&
        tab.left !== left
      ) {
        tab.setLeft(left, animation);
      } else {
        tab.setLeft(left, false);
      }

      left += tab.width + TABS_PADDING;
    }

    store.addTabStore.setLeft(Math.min(left, containerWidth), animation);
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
