import { observable, observe, action } from 'mobx';
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
import { ipcRenderer, remote } from 'electron';
import { extname } from 'path';
import { getColorBrightness } from '../utils';
import Vibrant = require('node-vibrant');

export class TabsStore {
  @observable
  public isDragging: boolean = false;

  @observable
  public scrollbarVisible: boolean = false;

  @observable
  public hoveredTabId: number;

  @observable
  public list: Tab[] = [];

  @observable
  public scrollable = false;

  public removedTabs: number = 0;

  public lastScrollLeft: number = 0;
  public lastMouseX: number = 0;
  public mouseStartX: number = 0;
  public tabStartX: number = 0;

  public closedUrl = '';

  public scrollbarRef = React.createRef<HorizontalScrollbar>();
  public containerRef = React.createRef<HTMLDivElement>();

  private rearrangeTabsTimer = {
    canReset: false,
    time: 0,
    interval: null as any,
  };

  constructor() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);

    this.rearrangeTabsTimer.interval = setInterval(() => {
      // Set widths and positions for tabs 3 seconds after a tab was closed
      if (
        this.rearrangeTabsTimer.canReset &&
        this.rearrangeTabsTimer.time === 3
      ) {
        this.removedTabs = 0;
        this.updateTabsBounds(true);
        this.rearrangeTabsTimer.canReset = false;
      }
      this.rearrangeTabsTimer.time++;
    }, 1000);

    ipcRenderer.on('tabs-resize', (e: any) => {
      this.updateTabsBounds(false);
    });

    ipcRenderer.on(
      'api-tabs-create',
      (
        e: any,
        options: chrome.tabs.CreateProperties,
        isNext: boolean,
        id: number,
      ) => {
        if (isNext) {
          const index =
            store.tabGroups.currentGroup.tabs.indexOf(this.selectedTab) + 1;
          options.index = index;
        }

        this.createTab(options, id);
      },
    );

    ipcRenderer.on('add-tab', (e: any, options: any) => {
      let tab = this.list.find(x => x.id === options.id);

      if (tab) {
        tab.isClosing = false;
        this.updateTabsBounds(true);
        clearTimeout(tab.removeTimeout);

        if (options.active) {
          tab.select();
        }
      } else {
        tab = this.createTab({}, options.id, true);
        tab.title = options.title;
        tab.favicon = URL.createObjectURL(new Blob([options.icon]));

        Vibrant.from(options.icon)
          .getPalette()
          .then(palette => {
            if (getColorBrightness(palette.Vibrant.hex) < 170) {
              tab.background = palette.Vibrant.hex;
            }
          });

        tab.select();
      }
    });

    ipcRenderer.on('remove-tab', (e: any, id: number) => {
      const tab = this.getTabById(id);
      if (tab) {
        tab.close();
      }
    });

    ipcRenderer.on('update-tab-title', (e: any, data: any) => {
      const tab = this.getTabById(data.id);
      if (tab) {
        tab.title = data.title;
      }
    });

    ipcRenderer.on('select-tab', (e: any, id: number) => {
      const tab = this.getTabById(id);
      if (tab) {
        tab.select();
      }
    });

    ipcRenderer.on(
      `found-in-page`,
      (
        e: any,
        { activeMatchOrdinal, matches, requestId }: Electron.FoundInPageResult,
      ) => {
        const tab = this.list.find(x => x.findRequestId === requestId);

        if (tab) {
          tab.findOccurrences = `${activeMatchOrdinal}/${matches}`;
        }
      },
    );
  }

  public resetRearrangeTabsTimer() {
    this.rearrangeTabsTimer.time = 0;
    this.rearrangeTabsTimer.canReset = true;
  }

  @action
  public onResize = (e: Event) => {
    if (e.isTrusted) {
      this.removedTabs = 0;
      this.updateTabsBounds(false);
    }
  };

  public get containerWidth() {
    if (this.containerRef.current) {
      return this.containerRef.current.offsetWidth;
    }
    return 0;
  }

  public get selectedTab() {
    return this.getTabById(store.tabGroups.currentGroup.selectedTabId);
  }

  public get hoveredTab() {
    return this.getTabById(this.hoveredTabId);
  }

  public getTabById(id: number) {
    return this.list.find(x => x.id === id);
  }

  @action public createTab(
    options: chrome.tabs.CreateProperties,
    id: number,
    isWindow: boolean = false,
  ) {
    if (isWindow) {
      store.overlay.visible = false;
    }

    if (options.active) {
      store.overlay.visible = false;
    }

    this.removedTabs = 0;

    const tab = new Tab(options, id, store.tabGroups.currentGroupId, isWindow);

    if (options.index !== undefined) {
      this.list.splice(options.index, 0, tab);
    } else {
      this.list.push(tab);
    }

    if (!isWindow) {
      this.emitEvent('onCreated', tab.getApiTab());
    }

    requestAnimationFrame(() => {
      tab.setLeft(tab.getLeft(), false);
      this.updateTabsBounds(true);

      this.scrollbarRef.current.scrollToEnd(TAB_ANIMATION_DURATION * 1000);
    });
    return tab;
  }

  @action
  public addTab(options = defaultTabOptions) {
    ipcRenderer.send('view-create', options);
  }

  public removeTab(id: number) {
    (this.list as any).remove(this.getTabById(id));
  }

  @action
  public updateTabsBounds(animation: boolean) {
    this.setTabsWidths(animation);
    this.setTabsLefts(animation);
  }

  @action
  public setTabsWidths(animation: boolean) {
    const tabs = this.list.filter(
      x => !x.isClosing && x.tabGroupId === store.tabGroups.currentGroupId,
    );

    const containerWidth = this.containerWidth;

    for (const tab of tabs) {
      const width = tab.getWidth(containerWidth, tabs);
      tab.setWidth(width, animation);

      this.scrollable = width === 72;
    }
  }

  @action
  public setTabsLefts(animation: boolean) {
    const tabs = this.list.filter(
      x => !x.isClosing && x.tabGroupId === store.tabGroups.currentGroupId,
    );

    const { containerWidth } = store.tabs;

    let left = 0;

    for (const tab of tabs) {
      tab.setLeft(left, animation);

      left += tab.width + TABS_PADDING;
    }

    store.addTab.setLeft(
      Math.min(left, containerWidth + TABS_PADDING),
      animation,
    );
  }

  @action
  public replaceTab(firstTab: Tab, secondTab: Tab) {
    secondTab.setLeft(firstTab.getLeft(true), true);

    const index = this.list.indexOf(secondTab);

    this.list[this.list.indexOf(firstTab)] = secondTab;
    this.list[index] = firstTab;
  }

  public getTabsToReplace(callingTab: Tab, direction: string) {
    let tabs = this.list;

    const index = tabs.indexOf(callingTab);

    if (direction === 'left') {
      for (let i = index - 1; i >= 0; i--) {
        const tab = tabs[i];
        if (callingTab.left <= tab.width / 2 + tab.left) {
          this.replaceTab(tabs[i + 1], tab);
        } else {
          break;
        }
      }
    } else if (direction === 'right') {
      for (let i = index + 1; i < tabs.length; i++) {
        const tab = tabs[i];
        if (callingTab.left + callingTab.width >= tab.width / 2 + tab.left) {
          this.replaceTab(tabs[i - 1], tab);
        } else {
          break;
        }
      }
    }
  }

  @action
  public onMouseUp = () => {
    const selectedTab = this.selectedTab;

    this.isDragging = false;

    this.setTabsLefts(true);

    if (selectedTab) {
      selectedTab.isDragging = false;
    }
  };

  @action
  public onMouseMove = (e: any) => {
    const tabGroup = store.tabGroups.currentGroup;
    if (!tabGroup) return;

    const { selectedTab } = store.tabs;

    if (this.isDragging) {
      const container = this.containerRef;
      const { tabStartX, mouseStartX, lastMouseX, lastScrollLeft } = store.tabs;

      const boundingRect = container.current.getBoundingClientRect();

      if (Math.abs(e.pageX - mouseStartX) < 5) {
        return;
      }

      store.canToggleMenu = false;
      selectedTab.isDragging = true;

      const newLeft =
        tabStartX +
        e.pageX -
        mouseStartX -
        (lastScrollLeft - container.current.scrollLeft);

      let left = Math.max(0, newLeft);

      if (
        newLeft + selectedTab.width >
        store.addTab.left + container.current.scrollLeft - TABS_PADDING
      ) {
        left =
          store.addTab.left - selectedTab.width + lastScrollLeft - TABS_PADDING;
      }

      selectedTab.setLeft(left, false);

      if (
        e.pageY > TOOLBAR_HEIGHT + 16 ||
        e.pageY < -16 ||
        e.pageX < boundingRect.left ||
        e.pageX - boundingRect.left > store.addTab.left
      ) {
        // TODO: Create a new window
      }

      this.getTabsToReplace(
        selectedTab,
        lastMouseX - e.pageX >= 1 ? 'left' : 'right',
      );

      this.lastMouseX = e.pageX;
    }
  };

  public animateProperty(
    property: string,
    obj: any,
    value: number,
    animation: boolean,
  ) {
    if (obj) {
      const props: any = {
        ease: animation ? TAB_ANIMATION_EASING : null,
      };
      props[property] = value;
      TweenLite.to(obj, animation ? TAB_ANIMATION_DURATION : 0, props);
    }
  }

  public emitEvent(name: string, ...data: any[]) {
    ipcRenderer.send('emit-tabs-event', name, ...data);
  }

  public onNewTab() {
    store.overlay.isNewTab = true;
    store.overlay.visible = true;
    ipcRenderer.send('hide-window');
  }
}
