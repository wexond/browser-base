import { observable, computed } from 'mobx';
import * as React from 'react';

import store from '~/renderer/app/store';
import { TabGroup } from './tab-group';
import {
  TABS_PADDING,
  TOOLBAR_HEIGHT,
  defaultTabOptions,
  TAB_ANIMATION_DURATION,
} from '~/renderer/app/constants';
import { ipcRenderer } from 'electron';
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
  public isBookmarked: boolean = false;

  @computed
  public get isSelected() {
    return this.tabGroup.selectedTab === this.id;
  }

  public url: string = '';
  public width: number = 0;
  public left: number = 0;
  public isClosing: boolean = false;
  public tabGroup: TabGroup;

  public ref = React.createRef<HTMLDivElement>();

  constructor(tabGroup: TabGroup, { url, active } = defaultTabOptions) {
    this.tabGroup = tabGroup;
    this.url = url;

    if (active) {
      this.select();
    }

    ipcRenderer.send('browserview-create', this.id);

    ipcRenderer.once(`browserview-created-${this.id}`, () => {
      ipcRenderer.send('browserview-select', this.id);
    });
  }

  public select() {
    if (!this.isClosing) {
      this.tabGroup.selectedTab = this.id;

      store.tabsStore.selectedTab = this.id;

      ipcRenderer.send('browserview-select', this.id);
    }
  }

  public getWidth(containerWidth: number = null, tabs: Tab[] = null) {
    if (containerWidth === null) {
      containerWidth = store.tabsStore.getContainerWidth();
    }

    if (tabs === null) {
      tabs = this.tabGroup.tabs.filter(x => !x.isClosing);
    }

    const width = containerWidth / tabs.length - TABS_PADDING;

    if (width > 200 - TABS_PADDING) {
      return 200 - TABS_PADDING;
    }
    if (width < 72 - TABS_PADDING) {
      return 72 - TABS_PADDING;
    }

    return width;
  }

  public getLeft() {
    const { tabs } = this.tabGroup;
    const index = tabs.indexOf(this);

    let left = 0;
    for (let i = 0; i < index; i++) {
      left += tabs[i].width + TABS_PADDING;
    }

    return left;
  }

  public getNewLeft() {
    const index = this.tabGroup.tabs.indexOf(this);

    let left = 0;
    for (let i = 0; i < index; i++) {
      left += this.getWidth() + TABS_PADDING;
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
    const { tabs } = this.tabGroup;
    const selected = this.tabGroup.selectedTab === this.id;

    ipcRenderer.send('browserview-remove', this.id);

    store.tabsStore.resetRearrangeTabsTimer();

    const notClosingTabs = tabs.filter(x => !x.isClosing);
    let index = notClosingTabs.indexOf(this);

    this.isClosing = true;
    if (notClosingTabs.length - 1 === index) {
      const previousTab = tabs[index - 1];
      if (previousTab) {
        this.setLeft(previousTab.getNewLeft() + this.getWidth(), true);
      }
      this.tabGroup.updateTabsBounds(true);
    }

    this.setWidth(0, true);
    this.tabGroup.setTabsLefts(true);

    if (selected) {
      index = tabs.indexOf(this);

      if (index + 1 < tabs.length && !tabs[index + 1].isClosing) {
        const nextTab = tabs[index + 1];
        nextTab.select();
      } else if (index - 1 >= 0 && !tabs[index - 1].isClosing) {
        const prevTab = tabs[index - 1];
        prevTab.select();
      } else if (store.tabsStore.groups.length === 1) {
        closeWindow();
      }
    }

    setTimeout(() => {
      this.tabGroup.removeTab(this.id);
    }, TAB_ANIMATION_DURATION * 1000);
  }

  public getApiTab(): chrome.tabs.Tab {
    const selected = store.tabsStore.getCurrentGroup().selectedTab === this.id;

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
