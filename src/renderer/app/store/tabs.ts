import { observable, computed } from 'mobx';
import { TabGroup } from '../models';
import { defaultCreateTabProperties } from '~/defaults/create-tab-properties';
import { TAB_ANIMATION_EASING, TAB_ANIMATION_DURATION } from '~/constants';
import { TweenLite } from 'gsap';
import HorizontalScrollbar from '@app/components/HorizontalScrollbar';

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

  @computed
  get isBookmarked() {
    return this.getSelectedTab().isBookmarked;
  }

  public lastScrollLeft: number = 0;
  public lastMouseX: number = 0;
  public mouseStartX: number = 0;
  public tabStartX: number = 0;

  public scrollbarRef: HorizontalScrollbar;
  public containerRef: HTMLDivElement;

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

  public getContainerWidth() {
    if (this.containerRef) return this.containerRef.offsetWidth;
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

  public addTab(details = defaultCreateTabProperties) {
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
