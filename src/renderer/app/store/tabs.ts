import { observable } from 'mobx';
import { TweenLite } from 'gsap';
import React from 'react';

import { TabGroup } from '~/renderer/app/models';

import {
  TAB_ANIMATION_EASING,
  TAB_ANIMATION_DURATION,
  defaultTabOptions,
} from '~/renderer/app/constants';

import HorizontalScrollbar from '~/renderer/app/components/HorizontalScrollbar';

export class TabsStore {
  @observable
  public isDragging: boolean = false;

  @observable
  public groups: TabGroup[] = [];

  @observable
  public currentGroup: number = 0;

  @observable
  public menuVisible: boolean = false;

  @observable
  public scrollbarVisible: boolean = false;

  @observable
  public selectedTab: number;

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
        this.getCurrentGroup().updateTabsBounds(true);
        this.rearrangeTabsTimer.canReset = false;
      }
      this.rearrangeTabsTimer.time++;
    }, 1000);
  }

  public resetRearrangeTabsTimer() {
    this.rearrangeTabsTimer.time = 0;
    this.rearrangeTabsTimer.canReset = true;
  }

  public nextTab() {
    const selectedTab = this.getSelectedTab();
    const { tabs } = this.getCurrentGroup();
    if (selectedTab.id + 1 === tabs.length + 1) {
      tabs[0].select();
    } else {
      tabs[selectedTab.id].select();
    }
  }

  public closeTab() {
    const selectedTab = this.getSelectedTab();
    const { tabs } = this.getCurrentGroup();
    const { tabGroup } = this.getSelectedTab();

    // TODO: remove page

    this.resetRearrangeTabsTimer();

    const notClosingTabs = tabs.filter(x => !x.isClosing);
    const index = notClosingTabs.indexOf(selectedTab);

    selectedTab.isClosing = true;
    if (notClosingTabs.length - 1 === index) {
      const previousTab = tabs[index - 1];
      selectedTab.setLeft(
        previousTab.getNewLeft() + selectedTab.getWidth(),
        true,
      );
      tabGroup.updateTabsBounds(true);
    }

    selectedTab.setWidth(0, true);
    tabGroup.setTabsLefts(true);
  }

  public removeGroup(id: number) {
    (this.groups as any).replace(this.groups.filter(x => x.id !== id));
  }

  public getContainerWidth() {
    if (this.containerRef) return this.containerRef.current.offsetWidth;
    return 0;
  }

  public getGroupById(id: number) {
    return this.groups.find(x => x.id === id);
  }

  public getCurrentGroup() {
    return this.getGroupById(this.currentGroup);
  }

  public getSelectedTab() {
    const group = this.getCurrentGroup();
    if (group) return group.getSelectedTab();
    return null;
  }

  public getTabById(id: number) {
    for (const group of this.groups) {
      const tab = group.getTabById(id);
      if (tab) return tab;
    }
    return null;
  }
  public addTab(details = defaultTabOptions) {
    return this.getCurrentGroup().addTab(details);
  }

  public addGroup() {
    const tabGroup: TabGroup = new TabGroup();
    this.groups.push(tabGroup);
    this.currentGroup = tabGroup.id;
    this.addTab();
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
