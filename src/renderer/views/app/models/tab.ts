import { observable, computed, action } from 'mobx';
import * as React from 'react';

import store from '../store';
import {
  TABS_PADDING,
  TAB_ANIMATION_DURATION,
  TAB_MIN_WIDTH,
  TAB_MAX_WIDTH,
  TAB_PINNED_WIDTH,
} from '../constants/tabs';
import { animateTab } from '../utils/tabs';
import { NEWTAB_URL } from '~/constants/tabs';

export class ITab {
  @observable
  public id: number;

  @observable
  public isDragging = false;

  @observable
  public isPinned = false;

  @observable
  public isMuted = false;

  @observable
  public isPlaying = false;

  @observable
  public title = 'New tab';

  @observable
  public loading = true;

  @observable
  public favicon = '';

  @observable
  public tabGroupId: number;

  @observable
  public addressbarValue: string = null;

  public addressbarFocused = false;
  public addressbarSelectionRange = [0, 0];

  public width = 0;
  public left = 0;

  @observable
  public url = '';

  @observable
  public blockedAds = 0;

  @observable
  public hasCredentials = false;

  public lastUrl = '';
  public isClosing = false;
  public ref = React.createRef<HTMLDivElement>();

  public removeTimeout: any;

  public marginLeft = 0;

  @computed
  public get isSelected() {
    return store.tabs.selectedTabId === this.id;
  }

  @computed
  public get isHovered() {
    return store.tabs.hoveredTabId === this.id;
  }

  @computed
  public get isExpanded() {
    return this.isHovered || this.isSelected || !store.tabs.scrollable;
  }

  @computed
  public get isBorderVisible() {
    if (this.isSelected || this.isHovered) return false;

    const index = store.tabs.list.indexOf(this);

    if (store.tabs.list.length - 1 > index) {
      const nextTab = store.tabs.list[index + 1];
      if (nextTab.isSelected || nextTab.isHovered) return false;
    }

    return true;
  }

  @computed
  public get isIconSet() {
    return this.favicon !== '' || this.loading;
  }

  public constructor({ active, url, pinned, id }: browser.tabs.Tab) {
    this.url = url;
    this.id = id;
    this.isPinned = pinned;

    if (NEWTAB_URL.startsWith(url)) {
      this.addressbarFocused = true;
    }
  }

  @action
  public async updateData() {
    // TODO: sandbox
    // if (!store.isIncognito) {
    //   await store.startupTabs.addStartupTabItem({
    //     id: this.id,
    //     windowId: store.windowId,
    //     url: this.url,
    //     favicon: this.favicon,
    //     pinned: !!this.isPinned,
    //     title: this.title,
    //     isUserDefined: false,
    //     order: store.tabs.list.indexOf(this),
    //   });
    // }
  }

  public get tabGroup() {
    return store.tabGroups.getGroupById(this.tabGroupId);
  }

  public getWidth(containerWidth: number = null, tabs: ITab[] = null) {
    if (this.isPinned) return TAB_PINNED_WIDTH;

    if (containerWidth === null) {
      containerWidth = store.tabs.containerWidth;
    }

    if (tabs === null) {
      tabs = store.tabs.list.filter((x) => !x.isClosing);
    }

    const pinnedTabs = tabs.filter((x) => x.isPinned).length;

    const realTabsLength = tabs.length - pinnedTabs + store.tabs.removedTabs;

    const width =
      (containerWidth - pinnedTabs * (TAB_PINNED_WIDTH + TABS_PADDING)) /
        realTabsLength -
      TABS_PADDING -
      store.tabs.leftMargins / realTabsLength;

    if (width > TAB_MAX_WIDTH) {
      return TAB_MAX_WIDTH;
    }
    if (width < TAB_MIN_WIDTH) {
      return TAB_MIN_WIDTH;
    }

    return width;
  }

  public getLeft(calcNewLeft = false) {
    const tabs = store.tabs.list.filter((x) => !x.isClosing).slice();

    const index = tabs.indexOf(this);

    let left = 0;

    if (calcNewLeft) store.tabs.calculateTabMargins();

    for (let i = 0; i < index; i++) {
      left +=
        (calcNewLeft ? tabs[i].getWidth() : tabs[i].width) +
        TABS_PADDING +
        tabs[i].marginLeft;
    }

    return left + this.marginLeft;
  }

  public removeFromGroup() {
    if (!this.tabGroup) return;

    if (this.tabGroup.tabs.length === 1) {
      store.tabGroups.list = store.tabGroups.list.filter(
        (x) => x.id !== this.tabGroupId,
      );
    }

    this.tabGroupId = undefined;
    store.tabs.updateTabsBounds(true);
  }

  @action
  public setLeft(left: number, animation: boolean) {
    animateTab('translateX', left, this.ref.current, animation);
    this.left = left;
  }

  @action
  public setWidth(width: number, animation: boolean) {
    animateTab('width', width, this.ref.current, animation);
    this.width = width;
  }

  @action
  public close() {
    // TODO: sandbox
    store.tabs.closedUrl = this.url;
    store.tabs.canShowPreview = false;
    // ipcRenderer.send(`hide-tab-preview-${store.windowId}`);

    const selected = store.tabs.selectedTabId === this.id;

    // store.startupTabs.removeStartupTabItem(this.id);

    // ipcRenderer.send(`view-destroy-${store.windowId}`, this.id);

    const notClosingTabs = store.tabs.list.filter((x) => !x.isClosing);
    let index = notClosingTabs.indexOf(this);

    if (notClosingTabs.length === 1) {
      // closeWindow();
    }

    this.isClosing = true;
    if (notClosingTabs.length - 1 === index) {
      const previousTab = store.tabs.list[index - 1];
      if (previousTab) {
        this.setLeft(previousTab.getLeft(true) + this.getWidth(), true);
      }
      store.tabs.updateTabsBounds(true);
    } else {
      store.tabs.removedTabs++;
    }

    this.removeFromGroup();

    this.setWidth(0, true);
    store.tabs.setTabsLefts(true);
    store.tabs.setTabGroupsLefts(true);

    if (selected) {
      index = store.tabs.list.indexOf(this);

      let idToSelect = 0;

      if (
        index + 1 < store.tabs.list.length &&
        !store.tabs.list[index + 1].isClosing &&
        !store.tabs.scrollable
      ) {
        idToSelect = store.tabs.list[index + 1].id;
      } else if (index - 1 >= 0 && !store.tabs.list[index - 1].isClosing) {
        idToSelect = store.tabs.list[index - 1].id;
      }

      browser.tabs.update(idToSelect, { active: true });
    }

    this.removeTimeout = setTimeout(() => {
      store.tabs.removeTab(this.id);
    }, TAB_ANIMATION_DURATION);
  }

  public callViewMethod = (scope: string, ...args: any[]): Promise<any> => {
    return callViewMethod(this.id, scope, ...args);
  };
}
