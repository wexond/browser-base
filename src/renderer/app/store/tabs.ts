import { observable } from 'mobx';
import { TweenLite } from 'gsap';
import * as React from 'react';

import { Tab } from '~/renderer/app/models';

import {
  TAB_ANIMATION_EASING,
  TAB_ANIMATION_DURATION,
  defaultTabOptions,
  TABS_PADDING,
} from '~/renderer/app/constants';

import HorizontalScrollbar from '~/renderer/app/components/HorizontalScrollbar';
import store from '.';

export class TabsStore {
  @observable
  public isDragging: boolean = false;

  @observable
  public scrollbarVisible: boolean = false;

  @observable
  public selectedTabId: number;

  @observable
  public tabs: Tab[] = [];

  public lastScrollLeft: number = 0;
  public lastMouseX: number = 0;
  public mouseStartX: number = 0;
  public tabStartX: number = 0;

  public scrollbarRef = React.createRef<HorizontalScrollbar>();
  public containerRef = React.createRef<HTMLDivElement>();

  private rearrangeTabsTimer = {
    canReset: false,
    time: 0,
    interval: null as any,
  };

  constructor() {
    this.rearrangeTabsTimer.interval = setInterval(() => {
      // Set widths and positions for tabs 3 seconds after a tab was closed
      if (
        this.rearrangeTabsTimer.canReset &&
        this.rearrangeTabsTimer.time === 3
      ) {
        this.updateTabsBounds(true);
        this.rearrangeTabsTimer.canReset = false;
      }
      this.rearrangeTabsTimer.time++;
    }, 1000);
  }

  public resetRearrangeTabsTimer() {
    this.rearrangeTabsTimer.time = 0;
    this.rearrangeTabsTimer.canReset = true;
  }

  public get containerWidth() {
    if (this.containerRef) return this.containerRef.current.offsetWidth;
    return 0;
  }

  public get selectedTab() {
    return this.getTabById(this.selectedTabId);
  }

  public getTabById(id: number) {
    return this.tabs.find(x => x.id === id);
  }

  public addTab(options = defaultTabOptions) {
    const tab = new Tab(options, store.tabGroupsStore.currentGroupId);
    this.tabs.push(tab);
    return tab;
  }

  public removeTab(id: number) {
    (this.tabs as any).replace(this.tabs.filter(x => x.id !== id));
  }

  public updateTabsBounds(animation: boolean) {
    this.setTabsWidths(animation);
    this.setTabsLefts(animation);
  }

  public setTabsWidths(animation: boolean) {
    const tabs = this.tabs.filter(
      x => !x.isClosing && x.tabGroupId === store.tabGroupsStore.currentGroupId,
    );

    const scrollLeft = store.tabsStore.containerRef.current.scrollLeft;
    const { containerWidth } = store.tabsStore;

    for (const tab of tabs) {
      const width = tab.getWidth(containerWidth, tabs);
      if (tab.width !== width) {
        if (
          tab.left + tab.width > scrollLeft &&
          tab.left < containerWidth + scrollLeft + 32
        ) {
          tab.setWidth(width, animation);
        } else {
          tab.setWidth(width, false);
        }
      }
    }
  }

  public setTabsLefts(animation: boolean) {
    const tabs = this.tabs.filter(
      x => !x.isClosing && x.tabGroupId === store.tabGroupsStore.currentGroupId,
    );

    const { containerWidth } = store.tabsStore;
    const scrollLeft = store.tabsStore.containerRef.current.scrollLeft;

    let left = 0;

    for (const tab of tabs) {
      if (tab.left !== left) {
        if (
          tab.left + tab.width > scrollLeft &&
          tab.left < containerWidth + scrollLeft + 32
        ) {
          tab.setLeft(left, animation);
        } else {
          tab.setLeft(left, false);
        }
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

  public animateProperty(
    property: string,
    ref: HTMLDivElement,
    value: number,
    animation: boolean,
  ) {
    if (ref) {
      const props: any = {
        ease: animation ? TAB_ANIMATION_EASING : null,
      };
      props[property] = value;
      TweenLite.to(ref, animation ? TAB_ANIMATION_DURATION : 0, props);
    }
  }
}
