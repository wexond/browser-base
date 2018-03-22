import { observable } from 'mobx';
import { TweenLite } from 'gsap';

// Constants and defaults
import {
  TAB_MAX_WIDTH,
  TAB_MIN_WIDTH,
  TAB_PINNED_WIDTH,
  TOOLBAR_BUTTON_WIDTH,
} from '../constants/design';
import tabAnimations from '../defaults/tab-animations';

import Store from '../store';

let nextTabId = 0;

export default class Tab {
  @observable public id = -1;
  @observable public title = 'New tab';
  @observable public pinned = false;
  @observable public isRemoving = false;
  @observable public hovered = false;
  @observable public dragging = false;

  public left = 0;
  public width = 0;

  public tab: HTMLDivElement;
  public tabGroup = Store.getCurrentTabGroup();

  constructor() {
    this.id = nextTabId++;
  }

  public getWidth(): number {
    const newTabs = this.tabGroup.tabs.filter(tab => !tab.isRemoving);
    const containerWidth = Store.getTabBarWidth();

    let width: number = this.pinned
      ? TAB_PINNED_WIDTH
      : (containerWidth - TOOLBAR_BUTTON_WIDTH) / newTabs.length;

    if (width > TAB_MAX_WIDTH) {
      width = TAB_MAX_WIDTH;
    }

    if (!this.pinned && width < TAB_MIN_WIDTH) {
      width = TAB_MIN_WIDTH;
    }

    return width;
  }

  public getLeft(): number {
    const { tabs } = this.tabGroup;

    let position = 0;
    for (let i = 0; i < tabs.indexOf(this); i++) {
      position += tabs[i].width;
    }
    return position;
  }

  public setLeft(left: number, animation = false) {
    if (animation) {
      TweenLite.to(this.tab, tabAnimations.left.duration, {
        x: left,
        ease: tabAnimations.left.easing,
      });
    } else {
      TweenLite.to(this.tab, 0, {
        x: left,
      });
    }

    this.left = left;
  }

  public setWidth(width: number, animation = false) {
    if (animation) {
      TweenLite.to(this.tab, tabAnimations.width.duration, {
        width,
        ease: tabAnimations.width.easing,
      });
    } else {
      TweenLite.to(this.tab, 0, {
        width,
      });
    }

    this.width = width;
  }
}
