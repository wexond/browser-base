import { ipcRenderer } from 'electron';
import { observable, computed, action } from 'mobx';
import * as React from 'react';

import store from '../store';
import {
  TABS_PADDING,
  TAB_ANIMATION_DURATION,
  TAB_MIN_WIDTH,
  TAB_MAX_WIDTH,
  TAB_PINNED_WIDTH,
} from '../constants';
import { getColorBrightness, callViewMethod } from '~/utils';
import { NEWTAB_URL } from '~/constants/tabs';
import { closeWindow } from '../utils/windows';

const isColorAcceptable = (color: string) => {
  if (store.theme['tab.allowLightBackground']) {
    return getColorBrightness(color) > 120;
  }

  return getColorBrightness(color) < 170;
};

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
  public title = 'New tab';

  @observable
  public loading = true;

  @observable
  public favicon = '';

  @observable
  public tabGroupId: number;

  @observable
  public width = 0;

  @observable
  public background = store.theme.accentColor;

  @observable
  public url = '';

  @observable
  public findInfo = {
    occurrences: '0/0',
    text: '',
    visible: false,
  };

  @observable
  public blockedAds = 0;

  @observable
  public hasCredentials = false;

  @observable
  public customColor = false;

  public left = 0;
  public lastUrl = '';
  public isClosing = false;
  public ref = React.createRef<HTMLDivElement>();

  public hasThemeColor = false;
  public removeTimeout: any;
  public isWindow = false;

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
  public get borderVisible() {
    const tabs = this.tabGroup.tabs;

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
    return this.isHovered || this.isSelected || !store.tabs.scrollable;
  }

  @computed
  public get isIconSet() {
    return this.favicon !== '' || this.loading;
  }

  public constructor(
    { active, url, pinned }: chrome.tabs.CreateProperties,
    id: number,
    isWindow: boolean,
  ) {
    this.url = url;
    this.id = id;
    this.isWindow = isWindow;
    this.isPinned = pinned;

    if (active) {
      requestAnimationFrame(() => {
        this.select();
      });
    }

    if (isWindow) return;

    ipcRenderer.on(`view-url-updated-${this.id}`, async (e, url: string) => {
      this.url = url;
      this.updateData();
    });

    ipcRenderer.on(`view-title-updated-${this.id}`, (e, title: string) => {
      this.title = title;
      this.updateData();
    });

    ipcRenderer.on(`view-did-navigate-${this.id}`, async (e, url: string) => {
      this.background = store.theme.accentColor;
      this.customColor = false;
      this.favicon = '';
    });

    ipcRenderer.on(
      `load-commit-${this.id}`,
      async (
        e,
        event,
        url: string,
        isInPlace: boolean,
        isMainFrame: boolean,
      ) => {
        if (isMainFrame) {
          this.blockedAds = 0;
        }
      },
    );

    ipcRenderer.on(`update-tab-favicon-${this.id}`, (e, favicon) => {
      this.favicon = favicon;
      this.updateData();
    });

    ipcRenderer.on(`update-tab-color-${this.id}`, (e, color) => {
      if (isColorAcceptable(color)) {
        this.background = color;
        this.customColor = true;
      } else {
        this.background = store.theme.accentColor;
        this.customColor = false;
      }
    });

    ipcRenderer.on(`blocked-ad-${this.id}`, () => {
      this.blockedAds++;
    });

    ipcRenderer.on(
      `browserview-theme-color-updated-${this.id}`,
      (e, themeColor: string) => {
        if (themeColor && isColorAcceptable(themeColor)) {
          this.background = themeColor;
          this.hasThemeColor = true;
          this.customColor = true;
        } else {
          this.background = store.theme.accentColor;
          this.hasThemeColor = false;
          this.customColor = false;
        }
      },
    );

    ipcRenderer.on(`tab-pinned-${this.id}`, (e, isPinned: boolean) => {
      this.isPinned = isPinned;
    });

    ipcRenderer.on(`view-loading-${this.id}`, (e, loading: boolean) => {
      this.loading = loading;
    });

    ipcRenderer.on(`has-credentials-${this.id}`, (e, found: boolean) => {
      this.hasCredentials = found;
    });

    const { defaultBrowserActions, browserActions } = store.extensions;

    for (const item of defaultBrowserActions) {
      const browserAction = { ...item };
      browserAction.tabId = this.id;
      browserActions.push(browserAction);
    }
  }

  @action
  public async updateData() {
    if (!store.isIncognito) {
      await store.startupTabs.addStartupTabItem({
        id: this.id,
        windowId: store.windowId,
        url: this.url,
        favicon: this.favicon,
        pinned: this.isPinned,
        title: this.title,
        isUserDefined: false,
      });
    }
  }

  public get tabGroup() {
    return store.tabGroups.getGroupById(this.tabGroupId);
  }

  @action
  public select() {
    if (!this.isClosing) {
      store.tabs.selectedTabId = this.id;

      if (this.isWindow) {
        ipcRenderer.send(`browserview-hide-${store.windowId}`);
        ipcRenderer.send(`select-window-${store.windowId}`, this.id);
      } else {
        ipcRenderer.send(`hide-window-${store.windowId}`);
        ipcRenderer.send(`browserview-show-${store.windowId}`);
        ipcRenderer.send(`view-select-${store.windowId}`, this.id);
        ipcRenderer.send(`update-find-info-${store.windowId}`, this.id, {
          ...this.findInfo,
        });

        if (this.url.startsWith(NEWTAB_URL)) {
          ipcRenderer.send(`search-show-${store.windowId}`);
        }
      }
    }
  }

  public getWidth(containerWidth: number = null, tabs: ITab[] = null) {
    if (this.isPinned) return TAB_PINNED_WIDTH;

    if (containerWidth === null) {
      containerWidth = store.tabs.containerWidth;
    }

    if (tabs === null) {
      tabs = store.tabs.list.filter(x => !x.isClosing);
    }

    const pinnedTabs = tabs.filter(x => x.isPinned).length;

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
    const tabs = store.tabs.list.filter(x => !x.isClosing).slice();

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
        x => x.id !== this.tabGroupId,
      );
    }

    this.tabGroupId = undefined;
    store.tabs.updateTabsBounds(true);
  }

  @action
  public setLeft(left: number, animation: boolean) {
    store.tabs.animateProperty('x', this.ref.current, left, animation);
    this.left = left;
  }

  @action
  public setWidth(width: number, animation: boolean) {
    store.tabs.animateProperty('width', this.ref.current, width, animation);
    this.width = width;
  }

  @action
  public close() {
    store.tabs.closedUrl = this.url;
    store.tabs.canShowPreview = false;
    ipcRenderer.send(`hide-tab-preview-${store.windowId}`);

    const selected = store.tabs.selectedTabId === this.id;

    store.startupTabs.removeStartupTabItem(this.id, store.windowId);

    if (this.isWindow) {
      ipcRenderer.send(`detach-window-${store.windowId}`, this.id);
    } else {
      ipcRenderer.send(`view-destroy-${store.windowId}`, this.id);
    }

    const notClosingTabs = store.tabs.list.filter(x => !x.isClosing);
    let index = notClosingTabs.indexOf(this);

    if (notClosingTabs.length === 1) {
      closeWindow();
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

      if (
        index + 1 < store.tabs.list.length &&
        !store.tabs.list[index + 1].isClosing &&
        !store.tabs.scrollable
      ) {
        const nextTab = store.tabs.list[index + 1];
        nextTab.select();
      } else if (index - 1 >= 0 && !store.tabs.list[index - 1].isClosing) {
        const prevTab = store.tabs.list[index - 1];
        prevTab.select();
      }
    }

    this.removeTimeout = setTimeout(() => {
      store.tabs.removeTab(this.id);
    }, TAB_ANIMATION_DURATION * 1000);
  }

  public callViewMethod = (scope: string, ...args: any[]): Promise<any> => {
    return callViewMethod(store.windowId, this.id, scope, ...args);
  };
}
