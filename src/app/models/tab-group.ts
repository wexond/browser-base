import { observable, observe } from "mobx";

// Models
import Line from "./line";
import Tab from "./tab";

// Constants and defaults
import { TAB_MIN_WIDTH } from "../constants/design";

import Store from "../store";

export default class TabGroup {
    @observable public id: number = 0;
    @observable public selectedTab: number = -1;
    @observable public tabs: Tab[] = [];
    @observable public line = new Line();

    constructor() {
        observe(this, (change: any) => {
            if (change.name === "selectedTab") {
                requestAnimationFrame(() => {
                    this.line.moveToTab(this.getTabById(change.object.selectedTab));
                });
            }
        });
    }

    public getSelectedTab() {
      return this.getTabById(this.selectedTab);
    }

    public updateTabsBounds(animations = true) {
        this.setTabsWidths();
        this.setTabsPositions();
    }

    public setTabsPositions(animation = true) {
      const { tabs } = this;
      const newTabs = tabs.filter(tab => !tab.isRemoving);
    
      let left = 0;
    
      for (const item of newTabs) {
        item.setLeft(left, animation)
        left += item.targetWidth;
      }
    
      Store.addTabButton.setLeft(left);
    }

    public setTabsWidths (animation = true) {
      const { tabs } = this;
      const newTabs = tabs.filter(tab => !tab.isRemoving);
    
      for (const item of newTabs) {
        item.setWidth(item.getWidth(), animation)
      }
    }

    public getTabById = (id: number): Tab => {
      return this.tabs.filter(item => item.id === id)[0];
    }

    public addTab = (): Tab => {
      const index = this.tabs.push(new Tab()) - 1;
      const tab = this.tabs[index];
    
      this.selectTab(tab);
      Store.addPage(tab.id);
    
      return tab;
    }

    public removeTab(tab: Tab) {
        (this.tabs as any).replace(
            this.tabs.filter(
                ({ id }) => id !== tab.id
            )
        );
    }

    public selectTab(tab: Tab) {
        this.selectedTab = tab.id;
    }

    public replaceTab(callingTab: Tab, secondTab: Tab) {
      const { tabs } = this;
      const tabsCopy = tabs.slice();
      const firstIndex = tabsCopy.indexOf(callingTab);
      const secondIndex = tabsCopy.indexOf(secondTab);
    
      tabsCopy[firstIndex] = secondTab;
      tabsCopy[secondIndex] = callingTab;
    
      secondTab.animate("left", callingTab.getLeft());
    
      (this.tabs as any).replace(tabsCopy);
    }

    public getTabsToReplace(callingTab: Tab, direction: string) {
      const { tabs } = this;
    
      const index = tabs.indexOf(callingTab);
    
      const tabsToReplace = [] as Tab[];
      if (direction === "left") {
        for (let i = index; i--;) {
          if (callingTab.left <= tabs[i].width / 2 + tabs[i].left) {
            this.replaceTab(tabs[i + 1], tabs[i]);
            tabsToReplace.push(tabs[i]);
          }
        }
      } else if (direction === "right") {
        for (let i = index + 1; i < tabs.length; i++) {
          if (callingTab.left + callingTab.width >= tabs[i].width / 2 + tabs[i].left) {
            this.replaceTab(tabs[i - 1], tabs[i]);
            tabsToReplace.push(tabs[i]);
          }
        }
      }
    
      return tabsToReplace;
    }

    public getScrollingMode() {
        for (const tab of this.tabs) {
            if (!tab.pinned) {
                const width = tab.getWidth();
                return width <= TAB_MIN_WIDTH;
            }
        }
    }
}