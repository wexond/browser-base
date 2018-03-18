import { TweenLite } from 'gsap';
import { observable } from 'mobx';

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
  @observable public left = 0;
  @observable public width = 0;
  @observable public targetLeft = 0;
  @observable public targetWidth = 0;
  @observable public pinned = false;
  @observable public isRemoving = false;
  @observable public hovered = false;

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
      position += tabs[i].targetWidth;
    }
    return position;
  }

  public setLeft(left: number, animation = true) {
    if (this.targetLeft !== left) {
      if (animation) {
        this.animate('left', left);
      } else {
        this.left = left;
      }
      this.targetLeft = left;
    }
  }

  public setWidth(width: number, animation = true) {
    if (this.targetWidth !== width) {
      if (animation) {
        this.animate('width', width);
      } else {
        this.width = width;
      }
      this.targetWidth = width;
    }
  }

  public animate(property: 'width' | 'left', value: number) {
    const { easing, duration } = tabAnimations[property];

    TweenLite.to(this, duration, {
      [property]: value,
      ease: easing,
    });
  }
}
