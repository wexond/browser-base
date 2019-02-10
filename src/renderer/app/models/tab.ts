import { observable, computed } from 'mobx';
import * as React from 'react';
import { ipcRenderer } from 'electron';

import store from '~/renderer/app/store';
import {
  TABS_PADDING,
  TOOLBAR_HEIGHT,
  defaultTabOptions,
  TAB_ANIMATION_DURATION,
} from '~/renderer/app/constants';
import { closeWindow, getColorBrightness } from '../utils';
import { colors } from '~/renderer/constants';

let id = 0;

export class Tab {
  @observable
  public id: number = id++;

  @observable
  public isDragging: boolean = false;

  @observable
  public title: string = 'New tab';

  @observable
  public loading: boolean = false;

  @observable
  public favicon: string = '';

  @observable
  public tabGroupId: number;

  @observable
  public width: number = 0;

  @observable
  public position = id;

  @observable
  public background: string = colors.blue['500'];

  public left = 0;

  public tempPosition = id;

  @computed
  public get isSelected() {
    return store.tabsStore.selectedTabId === this.id;
  }

  @computed
  public get isHovered() {
    return store.tabsStore.hoveredTabId === this.id;
  }

  @computed
  public get borderVisible() {
    const tabs = this.tabGroup.tabs
      .slice()
      .sort((a, b) => a.position - b.position);

    const i = tabs.indexOf(this);
    const nextTab = tabs[i + 1];

    if (
      (nextTab && (nextTab.isHovered || nextTab.isSelected)) ||
      this.isSelected ||
      this.isHovered
    ) {
      return false;
    }

    return true;
  }

  @computed
  public get isExpanded() {
    return this.isHovered || this.isSelected || !store.tabsStore.scrollable;
  }

  @computed
  public get isIconSet() {
    return this.favicon !== '' || this.loading;
  }

  public url: string = '';

  public isClosing: boolean = false;

  public ref = React.createRef<HTMLDivElement>();

  public currentX = 0;

  constructor({ url, active } = defaultTabOptions, tabGroupId: number) {
    this.tabGroupId = tabGroupId;
    this.url = url;

    ipcRenderer.send('browserview-create', this.id);

    ipcRenderer.once(`browserview-created-${this.id}`, () => {
      if (active) {
        this.select();
      }
    });

    ipcRenderer.on(
      `browserview-title-updated-${this.id}`,
      (e: any, title: string) => {
        this.title = title;
      },
    );

    ipcRenderer.on(
      `browserview-favicon-updated-${this.id}`,
      (e: any, favicon: string) => {
        this.favicon = favicon;
      },
    );

    ipcRenderer.on(
      `browserview-theme-color-updated-${this.id}`,
      (e: any, themeColor: string) => {
        if (themeColor && getColorBrightness(themeColor) < 170) {
          this.background = themeColor;
        } else {
          this.background = colors.blue['500'];
        }
      },
    );
  }

  public get tabGroup() {
    return store.tabGroupsStore.getGroupById(this.tabGroupId);
  }

  public select() {
    if (!this.isClosing) {
      store.canToggleMenu = store.tabsStore.selectedTabId === this.id;

      this.tabGroup.selectedTabId = this.id;
      store.tabsStore.selectedTabId = this.id;

      ipcRenderer.send('browserview-select', this.id);
    }
  }

  public getWidth(containerWidth: number = null, tabs: Tab[] = null) {
    if (containerWidth === null) {
      containerWidth = store.tabsStore.containerWidth;
    }

    if (tabs === null) {
      tabs = store.tabsStore.tabs.filter(
        x => x.tabGroupId === this.tabGroupId && !x.isClosing,
      );
    }

    const width = containerWidth / tabs.length - TABS_PADDING;

    if (width > 200) {
      return 200;
    }
    if (width < 72) {
      return 72;
    }

    return width;
  }

  public getLeft(reordering: boolean = false, calcNewLeft: boolean = false) {
    const tabs = this.tabGroup.tabs.slice();

    if (reordering) {
      tabs.sort((a, b) => a.tempPosition - b.tempPosition);
    } else {
      tabs.sort((a, b) => a.position - b.position);
    }

    const index = tabs.indexOf(this);

    let left = 0;
    for (let i = 0; i < index; i++) {
      left += (calcNewLeft ? this.getWidth() : tabs[i].width) + TABS_PADDING;
    }

    return left;
  }

  public setLeft(left: number, animation: boolean) {
    store.tabsStore.animateProperty('x', this.ref.current, left, animation);
    this.left = left;
  }

  public setWidth(width: number, animation: boolean) {
    store.tabsStore.animateProperty(
      'width',
      this.ref.current,
      width,
      animation,
    );
    this.width = width;
  }

  public close() {
    const tabGroup = this.tabGroup;
    const tabs = tabGroup.tabs.slice().sort((a, b) => a.position - b.position);

    const selected = tabGroup.selectedTabId === this.id;

    ipcRenderer.send('browserview-remove', this.id);

    const notClosingTabs = tabs.filter(x => !x.isClosing);
    let index = notClosingTabs.indexOf(this);

    store.tabsStore.resetRearrangeTabsTimer();

    this.isClosing = true;
    if (notClosingTabs.length - 1 === index) {
      const previousTab = tabs[index - 1];
      if (previousTab) {
        this.setLeft(previousTab.getLeft(false, true) + this.getWidth(), true);
      }
      store.tabsStore.updateTabsBounds(true);
    }

    this.setWidth(0, true);
    store.tabsStore.setTabsLefts(true);

    if (selected) {
      index = tabs.indexOf(this);

      if (
        index + 1 < tabs.length &&
        !tabs[index + 1].isClosing &&
        !store.tabsStore.scrollable
      ) {
        const nextTab = tabs[index + 1];
        nextTab.select();
      } else if (index - 1 >= 0 && !tabs[index - 1].isClosing) {
        const prevTab = tabs[index - 1];
        prevTab.select();
      } else if (store.tabGroupsStore.groups.length === 1) {
        closeWindow();
      }
    }

    setTimeout(() => {
      store.tabsStore.removeTab(this.id);
    }, TAB_ANIMATION_DURATION * 1000);
  }

  public getApiTab(): chrome.tabs.Tab {
    const selected = store.tabsStore.selectedTabId === this.id;

    return {
      id: this.id,
      index: this.tabGroup.tabs.indexOf(this),
      title: this.title,
      pinned: false,
      favIconUrl: this.favicon,
      url: this.url,
      status: this.loading ? 'loading' : 'complete',
      width: this.width,
      height: TOOLBAR_HEIGHT,
      active: selected,
      highlighted: selected,
      selected,
      windowId: 0,
      discarded: false,
      incognito: false,
      autoDiscardable: false,
    };
  }
}
