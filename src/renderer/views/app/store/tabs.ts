import { observable, action, computed } from 'mobx';
import * as React from 'react';

import { ITab } from '../models';

import {
  TAB_ANIMATION_DURATION,
  TABS_PADDING,
  TAB_MAX_WIDTH,
} from '../constants';

import HorizontalScrollbar from '~/renderer/components/HorizontalScrollbar';
import store from '.';
import { ipcRenderer } from 'electron';
import { defaultTabOptions } from '~/constants/tabs';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { TweenLite } from 'gsap';

export class TabsStore {
  @observable
  public isDragging = false;

  @observable
  public scrollbarVisible = false;

  @observable
  public hoveredTabId: number;

  @observable
  public list: ITab[] = [];

  @observable
  public scrollable = false;

  public removedTabs = 0;

  public lastScrollLeft = 0;
  public lastMouseX = 0;
  public mouseStartX = 0;
  public tabStartX = 0;

  public closedUrl = '';

  public canShowPreview = true;

  public scrollbarRef = React.createRef<HorizontalScrollbar>();
  public containerRef = React.createRef<HTMLDivElement>();

  private rearrangeTabsTimer = {
    canReset: false,
    time: 0,
    interval: null as any,
  };

  @computed
  public get selectedTab() {
    return this.getTabById(store.tabGroups.currentGroup.selectedTabId);
  }

  @computed
  public get hoveredTab() {
    return this.getTabById(this.hoveredTabId);
  }

  public constructor() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);

    this.rearrangeTabsTimer.interval = setInterval(() => {
      // Set widths and positions for tabs 3 seconds after a tab was closed
      if (
        this.rearrangeTabsTimer.canReset &&
        this.rearrangeTabsTimer.time === 3
      ) {
        this.rearrangeTabsTimer.canReset = false;
      }
      this.rearrangeTabsTimer.time++;
    }, 1000);

    ipcRenderer.on('tabs-resize', () => {
      this.updateTabsBounds(true);
    });

    ipcRenderer.on(
      'api-tabs-create',
      (
        e,
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

    ipcRenderer.on('add-tab', async (e, options) => {
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
        tab.select();

        /*const color = await getVibrantColor(options.icon);

        if (getColorBrightness(color) < 170) {
          tab.background = color;
        }*/
      }
    });

    ipcRenderer.on('remove-tab', (e, id: number) => {
      const tab = this.getTabById(id);
      if (tab) {
        tab.close();
      }
    });

    ipcRenderer.on('update-tab-title', (e, data) => {
      const tab = this.getTabById(data.id);
      if (tab) {
        tab.title = data.title;
      }
    });

    ipcRenderer.on('select-tab', (e, id: number) => {
      const tab = this.getTabById(id);
      if (tab) {
        tab.select();
      }
    });

    ipcRenderer.on('select-next-tab', () => {
      const { tabs } = store.tabGroups.currentGroup;
      const i = tabs.indexOf(this.selectedTab);
      const nextTab = tabs[i + 1];

      if (!nextTab) {
        if (tabs[0]) {
          tabs[0].select();
        }
      } else {
        nextTab.select();
      }
    });

    ipcRenderer.on('update-tab-find-info', (e, tabId: number, data) => {
      const tab = this.getTabById(tabId);
      if (tab) {
        tab.findInfo = data;
      }
    });

    ipcRenderer.on('revert-closed-tab', () => {
      this.revertClosed();
    });

    ipcRenderer.on('get-search-tabs', () => {
      ipcRenderer.send(
        'get-search-tabs',
        this.list.map(tab => ({
          favicon: tab.favicon,
          url: tab.url,
          title: tab.title,
          id: tab.id,
        })),
      );
    });
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

  public getTabById(id: number) {
    return this.list.find(x => x.id === id);
  }

  @action public createTab(
    options: chrome.tabs.CreateProperties,
    id: number,
    isWindow = false,
  ) {
    this.removedTabs = 0;

    const tab = new ITab(options, id, store.tabGroups.currentGroupId, isWindow);

    if (options.index !== undefined) {
      this.list.splice(options.index, 0, tab);
    } else {
      this.list.push(tab);
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
    ipcRenderer.send(`view-create-${store.windowId}`, options);
  }

  public removeTab(id: number) {
    (this.list as any).remove(this.getTabById(id));
  }

  @action
  public pinTab(tab: ITab) {
    tab.isPinned = true;
    store.startupTabs.updateStartupTabItem(tab);
    requestAnimationFrame(() => {
      tab.setLeft(0, false);
      this.getTabsToReplace(tab, 'left');
      this.updateTabsBounds(true);
    });
  }

  @action
  public unpinTab(tab: ITab) {
    tab.isPinned = false;
    store.startupTabs.updateStartupTabItem(tab);
    requestAnimationFrame(() => {
      tab.setLeft(
        Math.max(
          ...this.list.map(function(item) {
            return item.left;
          }),
        ) + TAB_MAX_WIDTH,
        false,
      );
      this.getTabsToReplace(tab, 'right');
      this.updateTabsBounds(true);
    });
  }

  @action
  public muteTab(tab: ITab) {
    ipcRenderer.send(`mute-view-${store.windowId}`, tab.id);
    tab.isMuted = true;
  }

  @action
  public unmuteTab(tab: ITab) {
    ipcRenderer.send(`unmute-view-${store.windowId}`, tab.id);
    tab.isMuted = false;
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
  public replaceTab(firstTab: ITab, secondTab: ITab) {
    secondTab.setLeft(firstTab.getLeft(true), true);

    const index = this.list.indexOf(secondTab);

    this.list[this.list.indexOf(firstTab)] = secondTab;
    this.list[index] = firstTab;
  }

  public getTabsToReplace(callingTab: ITab, direction: string) {
    const tabs = this.list;
    const index = tabs.indexOf(callingTab);

    if (direction === 'left') {
      for (let i = index - 1; i >= 0; i--) {
        const tab = tabs[i];
        if (
          callingTab.left <= tab.width / 2 + tab.left &&
          (!callingTab.isPinned || (callingTab.isPinned && tab.isPinned))
        ) {
          this.replaceTab(tabs[i + 1], tab);
        } else {
          break;
        }
      }
    } else if (direction === 'right') {
      for (let i = index + 1; i < tabs.length; i++) {
        const tab = tabs[i];
        if (
          callingTab.left + callingTab.width >= tab.width / 2 + tab.left &&
          (!callingTab.isPinned || (callingTab.isPinned && tab.isPinned))
        ) {
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

  public revertClosed() {
    this.addTab({ active: true, url: this.closedUrl });
  }

  public animateProperty(
    property: string,
    obj: any,
    value: number,
    animation: boolean,
  ) {
    if (obj) {
      const props: any = {
        ease: 'power2',
      };
      props[property] = value;

      TweenLite.to(obj, animation ? TAB_ANIMATION_DURATION : 0, props);
    }
  }

  public onNewTab() {
    ipcRenderer.send(`hide-window-${store.windowId}`);
    store.tabs.addTab();
  }
}
