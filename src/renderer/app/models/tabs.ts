import { Tab } from '.';
import {
  TABS_PADDING,
  TAB_ANIMATION_EASING,
  TAB_ANIMATION_DURATION,
  TOOLBAR_HEIGHT,
} from '../constants';
import { HorizontalScrollbar } from './horizontal-scrollbar';
import { TweenLite } from 'gsap';
import app from '..';
import { ipcRenderer } from 'electron';

export class Tabs {
  public list: Tab[] = [];

  public selectedTabId: number = 0;

  public container = document.getElementById('tabs');
  public addTabButton = document.getElementById('new-tab');

  public lastMouseX = 0;
  public isDragging = false;
  public mouseStartX = 0;
  public tabStartX = 0;
  public lastScrollX = 0;

  public addTabX = 0;

  private rearrangeTabsTimer = {
    canReset: false,
    time: 0,
    interval: null as any,
  };

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

    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);

    this.container.addEventListener('scroll', () => {
      const { scrollLeft, scrollWidth, offsetWidth } = app.tabs.container;

      app.toolbarSeparator2.style.visibility =
        this.list.indexOf(this.selectedTab) === this.list.length - 1 &&
        scrollLeft + offsetWidth === scrollWidth
          ? 'hidden'
          : 'visible';

      app.toolbarSeparator1.style.visibility =
        this.list.indexOf(this.selectedTab) === 0 && scrollLeft === 0
          ? 'hidden'
          : 'visible';
    });

    this.container.onmouseenter = () => {
      this.scrollbar.visible = true;
    };

    this.container.onmouseleave = () => {
      this.scrollbar.visible = false;
    };

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

    this.addTabButton.onclick = () => {
      this.addTab();
    };
  }

  public resetRearrangeTabsTimer() {
    this.rearrangeTabsTimer.time = 0;
    this.rearrangeTabsTimer.canReset = true;
  }

  public onMouseUp = () => {
    this.isDragging = false;
    this.setTabsLefts(true);

    if (this.selectedTab) {
      this.selectedTab.isDragging = false;
    }
  };

  public onMouseMove = (e: any) => {
    if (this.isDragging) {
      const boundingRect = this.container.getBoundingClientRect();

      if (Math.abs(e.pageX - this.mouseStartX) < 5) {
        return;
      }

      this.selectedTab.isDragging = true;
      // store.addressBarStore.canToggle = false;

      const newLeft =
        this.tabStartX +
        e.pageX -
        this.mouseStartX -
        (this.lastScrollX - this.container.scrollLeft);

      let left = Math.max(0, newLeft);

      if (
        newLeft + this.selectedTab.width >
        this.addTabX + this.container.scrollLeft
      ) {
        left = this.addTabX - this.selectedTab.width + this.lastScrollX;
      }

      this.selectedTab.setLeft(left, false);

      if (
        e.pageY > TOOLBAR_HEIGHT + 16 ||
        e.pageY < -16 ||
        e.pageX < boundingRect.left ||
        e.pageX - boundingRect.left > this.addTabX
      ) {
        // TODO: Create a new window
      }

      this.getTabsToReplace(
        this.selectedTab,
        this.lastMouseX - e.pageX >= 1 ? 'left' : 'right',
      );

      this.lastMouseX = e.pageX;
    }
  };

  public replaceTab(firstTab: Tab, secondTab: Tab) {
    const tabsCopy = this.list.slice();

    const firstIndex = tabsCopy.indexOf(firstTab);
    const secondIndex = tabsCopy.indexOf(secondTab);

    tabsCopy[firstIndex] = secondTab;
    tabsCopy[secondIndex] = firstTab;

    secondTab.setLeft(firstTab.getLeft(), true);

    this.list = tabsCopy;

    if (
      firstTab.selected &&
      app.tabs.container.scrollLeft === 0 &&
      this.list.indexOf(firstTab) === 0
    ) {
      app.toolbarSeparator1.style.visibility = 'hidden';
    }
  }

  public getTabsToReplace(callingTab: Tab, direction: string) {
    const index = this.list.indexOf(callingTab);

    if (direction === 'left') {
      for (let i = index; i--;) {
        const tab = this.list[i];
        if (callingTab.left <= tab.width / 2 + tab.left) {
          this.replaceTab(this.list[i + 1], tab);
        } else {
          break;
        }
      }
    } else if (direction === 'right') {
      for (let i = index + 1; i < this.list.length; i++) {
        const tab = this.list[i];
        if (callingTab.left + callingTab.width >= tab.width / 2 + tab.left) {
          this.replaceTab(this.list[i - 1], tab);
        } else {
          break;
        }
      }
    }
  }

  public updateTabsBounds = (animation: boolean) => {
    this.setTabsWidths(animation);
    this.setTabsLefts(animation);
  };

  public getTabById(id: number) {
    return this.list.find(x => x.id === id);
  }

  public get selectedTab() {
    return this.getTabById(this.selectedTabId);
  }

  public addTab() {
    const tab = new Tab();

    this.list.push(tab);

    tab.setLeft(tab.getLeft(), false);
    this.updateTabsBounds(true);

    this.scrollbar.scrollToEnd(TAB_ANIMATION_DURATION * 1000);

    if (true) {
      ipcRenderer.once(`browserview-created-${tab.id}`, () => {
        ipcRenderer.send('browserview-select', tab.id);
      });

      tab.select();
    }
  }

  public setTabsWidths = (animation: boolean) => {
    const tabsTemp = this.list.filter(
      x => !x.isClosing && x.tabGroupId === app.tabGroups.currentGroupId,
    );

    const { offsetWidth } = this.container;

    for (const tab of tabsTemp) {
      const width = tab.getWidth(offsetWidth, tabsTemp);
      if (tab.width !== width) {
        tab.setWidth(width, animation);
      }
    }
  };

  public setTabsLefts = (animation: boolean) => {
    const tabsTemp = this.list.filter(
      x => !x.isClosing && x.tabGroupId === app.tabGroups.currentGroupId,
    );

    const { offsetWidth } = this.container;

    let left = 0;

    for (const tab of tabsTemp) {
      if (tab.left !== left) {
        tab.setLeft(left, animation);
      }

      left += tab.width + TABS_PADDING;
    }

    this.addTabX = Math.min(left, offsetWidth);

    this.animateProperty('x', this.addTabButton, this.addTabX, animation);
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
