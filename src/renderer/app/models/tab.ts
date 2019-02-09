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
import { closeWindow } from '../utils';

let id = 1;

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
  public hovered: boolean = false;

  @observable
  public tabGroupId: number;

  @observable
  public transformX: number = 0;

  @observable
  public animateX = false;

  public width: number = 0;
  public left = 0;

  @computed
  public get isSelected() {
    return store.tabsStore.selectedTabId === this.id;
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
  }

  public get tabGroup() {
    return store.tabGroupsStore.getGroupById(this.tabGroupId);
  }

  public select() {
    if (!this.isClosing) {
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

  public getLeft(calcNewLeft: boolean = false) {
    const { tabs } = this.tabGroup;
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
    const { tabs } = tabGroup;
    const selected = tabGroup.selectedTabId === this.id;

    ipcRenderer.send('browserview-remove', this.id);

    const notClosingTabs = tabs.filter(x => !x.isClosing);
    let index = notClosingTabs.indexOf(this);

    this.isClosing = true;
    if (notClosingTabs.length - 1 === index) {
      const previousTab = tabs[index - 1];
      if (previousTab) {
        this.setLeft(previousTab.getLeft(true) + this.getWidth(), true);
      }
      store.tabsStore.updateTabsBounds(true);
    }

    this.setWidth(0, true);
    store.tabsStore.setTabsLefts(true);

    if (selected) {
      index = tabs.indexOf(this);

      if (index + 1 < tabs.length && !tabs[index + 1].isClosing) {
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
