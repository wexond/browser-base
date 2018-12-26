import { Tab } from './models';
import {
  TABS_PADDING,
  TAB_ANIMATION_EASING,
  TAB_ANIMATION_DURATION,
} from './constants';
import { HorizontalScrollbar } from './horizontal-scrollbar';
import { TweenLite } from 'gsap';

export class TabsStore {
  public list: Tab[] = [];

  public selectedTabId: number = 0;

  public container = document.getElementById('tabs');
  public addTabButton = document.getElementById('new-tab');

  public scrollbar = new HorizontalScrollbar(
    this.container,
    document.getElementById('tabs-scrollbar'),
    document.getElementById('tabs-scrollbar-thumb'),
  );

  constructor() {
    window.addEventListener('resize', e => {
      if (e.isTrusted) {
        this.updateTabsBounds(false);
      }
    });

    this.addTabButton.addEventListener('click', () => {
      new Tab(true);
    });
  }

  public updateTabsBounds = (animation: boolean) => {
    this.setTabsWidths(animation);
    this.setTabsLefts(animation);
  };

  public setTabsWidths = (animation: boolean) => {
    const tabsTemp = this.list.filter(x => !x.isClosing && x.tabGroupId === 0);

    const { scrollLeft, offsetWidth } = this.container;

    for (const tab of tabsTemp) {
      const width = tab.getWidth(offsetWidth, tabsTemp);
      if (tab.width !== width) {
        if (
          tab.left + tab.width > scrollLeft &&
          tab.left < offsetWidth + scrollLeft + TABS_PADDING + 1
        ) {
          tab.setWidth(width, animation);
        } else {
          tab.setWidth(width, false);
        }
      }
    }
  };

  public setTabsLefts = (animation: boolean) => {
    const tabsTemp = this.list.filter(x => !x.isClosing && x.tabGroupId === 0);

    const { scrollLeft, offsetWidth } = this.container;

    let left = 0;

    for (const tab of tabsTemp) {
      if (tab.left !== left) {
        if (
          tab.left + tab.width > scrollLeft &&
          tab.left < offsetWidth + scrollLeft + TABS_PADDING + 1
        ) {
          tab.setLeft(left, animation);
        } else {
          tab.setLeft(left, false);
        }
      }

      left += tab.width + TABS_PADDING;
    }
    this.animateProperty(
      'x',
      this.addTabButton,
      Math.min(left, offsetWidth),
      animation,
    );
  };

  public animateProperty = (
    property: string,
    ref: HTMLElement,
    value: number,
    animation: boolean,
  ) => {
    if (ref) {
      const props: any = {
        ease: animation ? TAB_ANIMATION_EASING : null,
      };
      props[property] = value;
      TweenLite.to(ref, animation ? TAB_ANIMATION_DURATION : 0, props);
    }
  };
}
