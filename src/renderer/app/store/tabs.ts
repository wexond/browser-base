import { observable, observe } from 'mobx';
import * as React from 'react';
import { TweenLite } from 'gsap';

import { Tab } from '~/renderer/app/models';

import {
  TAB_ANIMATION_DURATION,
  defaultTabOptions,
  TABS_PADDING,
  TOOLBAR_HEIGHT,
  TAB_ANIMATION_EASING,
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

  @observable
  public scrollable = false;

  public lastScrollLeft: number = 0;
  public lastMouseX: number = 0;
  public mouseStartX: number = 0;
  public tabStartX: number = 0;

  public scrollbarRef = React.createRef<HorizontalScrollbar>();
  public containerRef = React.createRef<HTMLDivElement>();

  constructor() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);
  }

  public onResize = (e: Event) => {
    if (e.isTrusted) {
      store.tabsStore.updateTabsBounds(false);
    }
  };

  public get containerWidth() {
    if (this.containerRef.current) {
      return this.containerRef.current.offsetWidth;
    }
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

    requestAnimationFrame(() => {
      tab.setLeft(tab.getLeft(), false);
      this.updateTabsBounds(true);

      this.scrollbarRef.current.scrollToEnd(TAB_ANIMATION_DURATION * 1000);
    });

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

    const containerWidth = this.containerWidth;

    for (const tab of tabs) {
      const width = tab.getWidth(containerWidth, tabs);
      tab.setWidth(width, animation);

      this.scrollable = width === 72;
    }
  }

  public setTabsLefts(animation: boolean) {
    const tabs = this.tabs.filter(
      x => !x.isClosing && x.tabGroupId === store.tabGroupsStore.currentGroupId,
    );

    const { containerWidth } = store.tabsStore;

    let left = 0;

    for (const tab of tabs) {
      tab.setLeft(left, animation);

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

  public onMouseUp = () => {
    const selectedTab = store.tabsStore.selectedTab;

    store.tabsStore.isDragging = false;
    store.tabsStore.setTabsLefts(true);

    if (selectedTab) {
      selectedTab.isDragging = false;
    }
  };

  public onMouseMove = (e: any) => {
    const tabGroup = store.tabGroupsStore.currentGroup;
    if (!tabGroup) return;

    const { selectedTab } = store.tabsStore;

    if (store.tabsStore.isDragging) {
      const container = store.tabsStore.containerRef;
      const {
        tabStartX,
        mouseStartX,
        lastMouseX,
        lastScrollLeft,
      } = store.tabsStore;

      const boundingRect = container.current.getBoundingClientRect();

      if (Math.abs(e.pageX - mouseStartX) < 5) {
        return;
      }

      selectedTab.isDragging = true;

      const newLeft =
        tabStartX +
        e.pageX -
        mouseStartX -
        (lastScrollLeft - container.current.scrollLeft);

      let left = Math.max(0, newLeft);

      if (
        newLeft + selectedTab.width >
        store.addTabStore.left + container.current.scrollLeft
      ) {
        left = store.addTabStore.left - selectedTab.width + lastScrollLeft;
      }

      selectedTab.setLeft(left, false);

      if (
        e.pageY > TOOLBAR_HEIGHT + 16 ||
        e.pageY < -16 ||
        e.pageX < boundingRect.left ||
        e.pageX - boundingRect.left > store.addTabStore.left
      ) {
        // TODO: Create a new window
      }

      store.tabsStore.getTabsToReplace(
        selectedTab,
        lastMouseX - e.pageX >= 1 ? 'left' : 'right',
      );

      store.tabsStore.lastMouseX = e.pageX;
    }
  };

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
