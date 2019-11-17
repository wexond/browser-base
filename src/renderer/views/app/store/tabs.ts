import { observable, action, computed } from 'mobx';
import * as React from 'react';

import { ITab } from '../models';

import {
  TAB_ANIMATION_DURATION,
  TABS_PADDING,
  TAB_MAX_WIDTH,
} from '../constants';

import store from '.';
import { ipcRenderer } from 'electron';
import { defaultTabOptions } from '~/constants/tabs';
import { TOOLBAR_HEIGHT, TOOLBAR_BUTTON_WIDTH } from '~/constants/design';
import { TweenLite } from 'gsap';

export class TabsStore {
  @observable
  public isDragging = false;

  @observable
  public hoveredTabId: number;

  @observable
  public list: ITab[] = [];

  @observable
  public selectedTabId: number;

  public removedTabs = 0;

  public lastScrollLeft = 0;
  public lastMouseX = 0;
  public mouseStartX = 0;
  public tabStartX = 0;

  private scrollTimeout: any;

  public scrollingToEnd = false;
  public scrollable = false;

  public closedUrl = '';

  public canShowPreview = true;

  public containerRef = React.createRef<HTMLDivElement>();

  public leftMargins = 0;

  @computed
  public get selectedTab() {
    return this.getTabById(this.selectedTabId);
  }

  @computed
  public get hoveredTab() {
    return this.getTabById(this.hoveredTabId);
  }

  public constructor() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);

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
          const index = this.list.indexOf(this.selectedTab) + 1;
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

        /*
        TODO:
        const color = await getVibrantColor(options.icon);

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
      const i = this.list.indexOf(this.selectedTab);
      const nextTab = this.list[i + 1];

      if (!nextTab) {
        if (this.list[0]) {
          this.list[0].select();
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

    const tab = new ITab(options, id, isWindow);

    if (options.index !== undefined) {
      this.list.splice(options.index, 0, tab);
    } else {
      this.list.push(tab);
    }

    requestAnimationFrame(() => {
      tab.setLeft(tab.getLeft(), false);
      this.updateTabsBounds(true);

      this.scrollToEnd(TAB_ANIMATION_DURATION * 1000);
    });
    return tab;
  }

  public scrollToEnd = (milliseconds: number) => {
    if (!this.scrollable) return;

    const frame = () => {
      if (!this.scrollingToEnd) return;
      this.containerRef.current.scrollLeft = this.containerRef.current.scrollWidth;
      requestAnimationFrame(frame);
    };

    if (!this.scrollingToEnd) {
      this.scrollingToEnd = true;
      frame();
    }

    clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {
      this.scrollingToEnd = false;
    }, milliseconds);
  };

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
    this.calculateTabMargins();
    this.setTabsWidths(animation);
    this.setTabGroupsLefts(animation);
    this.setTabsLefts(animation);
  }

  public calculateTabMargins() {
    const tabs = this.list.filter(x => !x.isClosing);

    let currentGroup: number;

    this.leftMargins = 0;

    for (const tab of tabs) {
      tab.marginLeft = 0;

      if (tab.tabGroupId !== currentGroup) {
        if (tab.tabGroup && tab.tabGroup.ref) {
          tab.marginLeft =
            tab.tabGroup.ref.current.offsetWidth + 16 + TABS_PADDING;
        } else {
          tab.marginLeft = 8;
        }

        currentGroup = tab.tabGroupId;
      }

      this.leftMargins += tab.marginLeft;
    }
  }

  public setTabGroupsLefts(animation: boolean) {
    const tabs = this.list.filter(x => !x.isClosing);

    let left = 0;
    let currentGroup: number;

    for (const tab of tabs) {
      if (tab.tabGroupId !== currentGroup) {
        if (tab.tabGroup) {
          tab.tabGroup.setLeft(left + 8, animation && !tab.tabGroup.isNew);
          tab.tabGroup.isNew = false;
        }

        left += tab.marginLeft;

        currentGroup = tab.tabGroupId;
      }

      left += tab.width + TABS_PADDING;
    }
  }

  @action
  public setTabsWidths(animation: boolean) {
    const tabs = this.list.filter(x => !x.isClosing);

    const containerWidth = this.containerWidth;
    let currentGroup: number;

    for (const tab of tabs) {
      const width = tab.getWidth(containerWidth, tabs);
      tab.setWidth(width, animation);

      if (tab.tabGroup) {
        if (tab.tabGroupId !== currentGroup) {
          tab.tabGroup.width = 0;
          currentGroup = tab.tabGroupId;
        }
        tab.tabGroup.width += width + TABS_PADDING;
      }

      this.scrollable = width === 72;
    }
  }

  @action
  public setTabsLefts(animation: boolean) {
    const tabs = this.list.filter(x => !x.isClosing);

    const { containerWidth } = store.tabs;

    let left = 0;

    for (const tab of tabs) {
      left += tab.marginLeft;

      if (!tab.isDragging) {
        tab.setLeft(left, animation);
      }

      left += tab.width + TABS_PADDING;
    }

    store.addTab.setLeft(
      Math.min(left, containerWidth + TABS_PADDING),
      animation,
    );
  }

  @action
  public replaceTab(firstTab: ITab, secondTab: ITab) {
    const index = this.list.indexOf(secondTab);

    this.list[this.list.indexOf(firstTab)] = secondTab;
    this.list[index] = firstTab;

    this.updateTabsBounds(true);
  }

  public getTabsToReplace(callingTab: ITab, direction: string) {
    const tabs = this.list;
    const index = tabs.indexOf(callingTab);

    const { tabGroup } = callingTab;
    if (tabGroup) {
      if (
        callingTab.left < tabGroup.left ||
        callingTab.left + callingTab.width >=
          tabGroup.left + tabGroup.width + 20
      ) {
        callingTab.removeFromGroup();
        return;
      }
    }

    if (direction === 'left') {
      for (let i = index - 1; i >= 0; i--) {
        const tab = tabs[i];

        if (callingTab.isPinned && callingTab.isPinned && tab.isPinned) break;

        const { tabGroup } = tab;

        if (tabGroup) {
          const tabGroupTabs = tab.tabGroup.tabs;
          const lastTab = tabGroupTabs[tabGroupTabs.length - 1];

          if (
            callingTab.tabGroupId !== tab.tabGroupId &&
            callingTab.left <= lastTab.left + lastTab.width * 0.75
          ) {
            callingTab.tabGroupId = tab.tabGroupId;
            this.updateTabsBounds(true);
          }
        }

        if (callingTab.left <= tab.width / 2 + tab.left) {
          this.replaceTab(tabs[i + 1], tab);
        } else {
          break;
        }
      }
    } else if (direction === 'right') {
      for (let i = index + 1; i < tabs.length; i++) {
        const tab = tabs[i];

        if (callingTab.isPinned && callingTab.isPinned && tab.isPinned) break;

        const { tabGroup } = tab;

        if (tabGroup) {
          const tabGroupTabs = tab.tabGroup.tabs;
          const firstTab = tabGroupTabs[0];

          if (
            callingTab.tabGroupId !== tab.tabGroupId &&
            callingTab.left + callingTab.width >= firstTab.left
          ) {
            callingTab.tabGroupId = tab.tabGroupId;
            this.updateTabsBounds(true);
          }
        }

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

    if (selectedTab) {
      selectedTab.isDragging = false;
    }

    this.updateTabsBounds(true);
  };

  @action
  public onMouseMove = (e: any) => {
    const { selectedTab } = this;

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
        container.current.scrollLeft +
          container.current.offsetWidth -
          TABS_PADDING +
          20
      ) {
        left =
          container.current.scrollLeft +
          container.current.offsetWidth -
          selectedTab.width -
          TABS_PADDING +
          20;
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
