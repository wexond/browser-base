import { observable, observe } from 'mobx';

import { Tab, TabsIndicator, AddTabButton } from '.';
import store from '../renderer/store';
import { emitEvent } from '../utils';
import { TAB_MIN_WIDTH, WORKSPACE_MAX_ICONS_COUNT } from '../constants';
import { icons } from '../defaults';

let nextWorkspaceId = 0;

export class Workspace {
  @observable
  public id: number = -1;

  @observable
  public name: string = 'Workspace';

  @observable
  public selectedTab: number = -1;

  @observable
  public tabs: Tab[] = [];

  @observable
  public tabsIndicator = new TabsIndicator();

  @observable
  public addTabButton = new AddTabButton();

  @observable
  public scrollbar = {
    thumbWidth: 0,
    thumbLeft: 0,
    thumbVisible: false,
    visible: false,
  };

  public timer = {
    canReset: true,
    time: 0,
  };

  private interval: any;

  constructor() {
    observe(this, (change: any) => {
      if (change.name === 'selectedTab') {
        const tab = this.getTabById(change.object.selectedTab);
        requestAnimationFrame(() => {
          this.tabsIndicator.moveToTab(tab);
        });

        store.isBookmarked = !!store.bookmarks.find(x => x.url === tab.url);

        store.refreshNavigationState();
      }
    });

    this.interval = setInterval(() => {
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

    this.id = nextWorkspaceId++;
  }

  public getContainerWidth: () => number;

  public getSelectedTab() {
    return this.getTabById(this.selectedTab);
  }

  public updateTabsBounds(animations = true, tabToIgnore: Tab = null) {
    this.setTabsWidths(animations);
    this.setTabsPositions(animations, tabToIgnore);
  }

  public setTabsPositions(animation = true, tabToIgnore: Tab = null) {
    const { tabs, addTabButton } = this;
    const newTabs = tabs.filter(tab => !tab.isRemoving);

    let left = 0;

    for (const item of newTabs) {
      item.setLeft(left, item !== tabToIgnore ? animation : false);
      left += item.width;
    }

    left = Math.min(left, this.getContainerWidth());

    addTabButton.setLeft(left, animation);

    requestAnimationFrame(() => {
      this.tabsIndicator.moveToTab(this.getSelectedTab(), animation);
    });
  }

  public setTabsWidths(animation = true) {
    const { tabs } = this;
    const newTabs = tabs.filter(tab => !tab.isRemoving);

    for (const item of newTabs) {
      item.setWidth(item.getWidth(), animation);
    }
  }

  public getTabById = (id: number): Tab => this.tabs.filter(item => item.id === id)[0];

  public addTab = (
    createProperties: chrome.tabs.CreateProperties = { url: '', active: true },
  ): Tab => {
    const { active, url } = createProperties;
    let { index } = createProperties;

    if (index == null) {
      index = this.tabs.length;
    } else if (index < 0) {
      index = 0;
    } else if (index > this.tabs.length) {
      index = this.tabs.length;
    }

    const tab = new Tab(this);
    this.tabs.splice(index, 0, tab);

    if (active) this.selectTab(tab);
    store.addPage(tab.id, url);

    emitEvent('tabs', 'onCreated', tab.getIpcTab());

    return tab;
  };

  public removeTab(tab: Tab) {
    (this.tabs as any).replace(this.tabs.filter(({ id }) => id !== tab.id));
  }

  public selectTab(tab: Tab) {
    this.selectedTab = tab.id;

    if (tab.isNew) {
      setTimeout(() => {
        store.addressBar.toggled = true;
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
    const favicons = [];

    for (let i = 0; i < this.tabs.length; i++) {
      const icon = this.tabs[i].favicon;

      if (favicons.length < WORKSPACE_MAX_ICONS_COUNT) {
        favicons.push(icon !== '' ? icon : icons.page);
      }
    }

    return favicons;
  }

  public remove() {
    clearInterval(this.interval);
    store.workspaces.splice(store.workspaces.indexOf(this), 1);
  }
}
