import { observable, observe } from 'mobx';
import TabsIndicator from './tabs-indicator';
import Tab from './tab';
import { TAB_MIN_WIDTH, WORKSPACE_MAX_ICONS_COUNT } from '../constants';
import Store from '../store';

const pageIcon = require('../../shared/icons/page.svg');

export default class Workspace {
  @observable public id: number = 0;

  @observable public name: string = 'Workspace';

  @observable public selectedTab: number = -1;

  @observable public tabs: Tab[] = [];

  @observable public tabsIndicator = new TabsIndicator();

  public timer = {
    canReset: true,
    time: 0,
  };

  constructor() {
    observe(this, (change: any) => {
      if (change.name === 'selectedTab') {
        requestAnimationFrame(() => {
          this.tabsIndicator.moveToTab(this.getTabById(change.object.selectedTab));
        });
        Store.refreshNavigationState();
      }
    });

    setInterval(() => {
      // Set widths and positions for tabs 3 seconds after a tab was closed
      if (this.timer.canReset && this.timer.time === 3) {
        this.updateTabsBounds();
        requestAnimationFrame(() => {
          this.tabsIndicator.moveToTab(this.getTabById(this.selectedTab));
        });
        this.timer.canReset = false;
      }
      this.timer.time++;
    }, 1000);
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

    for (const item of newTabs) {
      item.setLeft(left, item !== tabToIgnore ? animation : false);
      left += item.width;
    }

    const marginLeft = parseInt(getComputedStyle(Store.addTabButton.ref).marginLeft, 10);

    left = Math.min(
      left,
      Store.getTabBarWidth() - (marginLeft + Store.addTabButton.ref.offsetWidth),
    );

    Store.addTabButton.setLeft(left, animation);
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

    return tab;
  };

  public removeTab(tab: Tab) {
    (this.tabs as any).replace(this.tabs.filter(({ id }) => id !== tab.id));
  }

  public selectTab(tab: Tab) {
    this.selectedTab = tab.id;

    if (tab.url.startsWith('wexond://newtab') || tab.url.trim() === '') {
      setTimeout(() => {
        Store.addressBar.toggled = true;
      }, 50);
    }
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

  public resetTimer() {
    this.timer = {
      time: 0,
      canReset: true,
    };
  }

  public getIcons() {
    const icons = [];

    for (let i = 0; i < this.tabs.length; i++) {
      const icon = this.tabs[i].favicon;

      if (icons.length < WORKSPACE_MAX_ICONS_COUNT) {
        icons.push(icon !== '' ? icon : pageIcon);
      }
    }

    return icons;
  }
}
