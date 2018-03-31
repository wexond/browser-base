import { observable, observe } from 'mobx';
import Line from './line';
import Tab from './tab';
import { TAB_MIN_WIDTH } from '../constants/design';
import Store from '../store';

export default class TabGroup {
  @observable public id: number = 0;
  @observable public selectedTab: number = -1;
  @observable public tabs: Tab[] = [];
  @observable public line = new Line();

  constructor() {
    observe(this, (change: any) => {
      if (change.name === 'selectedTab') {
        requestAnimationFrame(() => {
          this.line.moveToTab(this.getTabById(change.object.selectedTab));
        });
        Store.refreshNavigationState();
      }
    });
  }

  public getSelectedTab() {
    return this.getTabById(this.selectedTab);
  }

  public updateTabsBounds(animations = true, tabToIgnore: Tab = null) {
    this.setTabsWidths(animations);
    this.setTabsPositions(animations, tabToIgnore);
  }

  public setTabsPositions(animation = true, tabToIgnore: Tab = null) {
    const { tabs } = this;
    const newTabs = tabs.filter(tab => !tab.isRemoving);

    let left = 0;
    let addTabButtonLeft = 0;

    for (const item of newTabs) {
      if (item !== tabToIgnore) {
        item.setLeft(left, animation);
      } else {
        item.setLeft(left, false);
      }
      left += item.width;
      addTabButtonLeft += item.getInitialWidth();
    }

    Store.addTabButton.setLeft(addTabButtonLeft, animation);
  }

  public setTabsWidths(animation = true) {
    const { tabs } = this;
    const newTabs = tabs.filter(tab => !tab.isRemoving);

    for (const item of newTabs) {
      item.setWidth(item.getWidth(), animation);
    }
  }

  public getTabById = (id: number): Tab => this.tabs.filter(item => item.id === id)[0];

  public addTab = (): Tab => {
    const index = this.tabs.push(new Tab()) - 1;
    const tab = this.tabs[index];

    this.selectTab(tab);
    Store.addPage(tab.id);

    Store.addressBar.toggled = true;

    return tab;
  };

  public removeTab(tab: Tab) {
    (this.tabs as any).replace(this.tabs.filter(({ id }) => id !== tab.id));
  }

  public selectTab(tab: Tab) {
    this.selectedTab = tab.id;
  }

  public getTabsToReplace(callingTab: Tab, direction: string) {
    const { tabs } = this;

    const index = tabs.indexOf(callingTab);

    const replaceTab = (firstTab: Tab, secondTab: Tab) => {
      const tabsCopy = tabs.slice();
      const firstIndex = tabsCopy.indexOf(firstTab);
      const secondIndex = tabsCopy.indexOf(secondTab);

      tabsCopy[firstIndex] = secondTab;
      tabsCopy[secondIndex] = firstTab;

      secondTab.setLeft(firstTab.getLeft(), true);

      (this.tabs as any).replace(tabsCopy);
    };

    if (direction === 'left') {
      for (let i = index; i--;) {
        if (callingTab.left <= tabs[i].width / 2 + tabs[i].left) {
          replaceTab(tabs[i + 1], tabs[i]);
        }
      }
    } else if (direction === 'right') {
      for (let i = index + 1; i < tabs.length; i++) {
        if (callingTab.left + callingTab.width >= tabs[i].width / 2 + tabs[i].left) {
          replaceTab(tabs[i - 1], tabs[i]);
        }
      }
    }
  }

  public getScrollingMode() {
    for (const tab of this.tabs) {
      if (!tab.pinned) {
        const width = tab.getWidth();
        return width <= TAB_MIN_WIDTH;
      }
    }
    return false;
  }
}
