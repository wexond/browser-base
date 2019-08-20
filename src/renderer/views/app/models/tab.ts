import { ipcRenderer, remote, webContents } from 'electron';
import { parse } from 'url';
import { observable, computed, action } from 'mobx';
import * as React from 'react';
import Vibrant = require('node-vibrant');

import store from '../store';
import { TABS_PADDING, TAB_ANIMATION_DURATION, TAB_MIN_WIDTH, TAB_MAX_WIDTH, TAB_PINNED_WIDTH } from '../constants';
import { getColorBrightness, callViewMethod } from '~/utils';
import console = require('console');

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
  public title: string = 'New tab';

  @observable
  public loading = false;

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

  public left = 0;
  public lastUrl = '';
  public isClosing = false;
  public ref = React.createRef<HTMLDivElement>();
  public lastHistoryId: string;
  public hasThemeColor = false;
  public removeTimeout: any;
  public isWindow: boolean = false;

  @computed
  public get isSelected() {
    return store.tabGroups.currentGroup.selectedTabId === this.id;
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
    tabGroupId: number,
    isWindow: boolean,
  ) {
    this.url = url;
    this.id = id;
    this.isWindow = isWindow;
    this.tabGroupId = tabGroupId;
    this.isPinned = pinned;

    if (active) {
      requestAnimationFrame(() => {
        this.select();
      });
    }

    if (isWindow) return;

    ipcRenderer.on(`view-url-updated-${this.id}`, async (e, url: string) => {
      if (url && url !== this.url && !store.isIncognito) {
        this.lastHistoryId = await store.history.addItem({
          title: this.title,
          url,
          favicon: this.favicon,
          date: new Date().toString(),
        });

        await store.startupTabs.addStartupTabItem({
          id: this.id,
          windowId: store.windowId,
          url: this.url,
          pinned: this.isPinned,
          title: this.title,
          favicon: this.favicon,
          isUserDefined: false
        });
      }

      this.url = url;
      this.updateData();
    });

    ipcRenderer.on(`view-title-updated-${this.id}`, (e, title: string) => {
      this.title = title === 'about:blank' ? 'New tab' : title;
      this.updateData();

      if (this.isSelected) {
        this.updateWindowTitle();
      }
    });

    ipcRenderer.on(
      `load-commit-${this.id}`,
      (e, event, url: string, isInPlace: boolean, isMainFrame: boolean) => {
        if (isMainFrame) {
          this.blockedAds = 0;
        }
      },
    );

    ipcRenderer.on(
      `browserview-favicon-updated-${this.id}`,
      async (e, favicon: string) => {
        try {
          this.favicon = favicon;

          let fav = favicon;
          if (favicon.startsWith('http')) {
            fav = await store.favicons.addFavicon(favicon);
          }
          const buf = Buffer.from(fav.split('base64,')[1], 'base64');

          if (!this.hasThemeColor) {
            try {
              const palette = await Vibrant.from(buf).getPalette();

              if (!palette.Vibrant) return;

              if (isColorAcceptable(palette.Vibrant.hex)) {
                this.background = palette.Vibrant.hex;
              } else {
                this.background = store.theme.accentColor;
              }
            } catch (e) {
              console.error(e);
            }
          }
        } catch (e) {
          this.favicon = '';
          console.error(e);
        }
        this.updateData();
      },
    );

    ipcRenderer.on(`blocked-ad-${this.id}`, () => {
      this.blockedAds++;
    });

    ipcRenderer.on(
      `browserview-theme-color-updated-${this.id}`,
      (e, themeColor: string) => {
        if (themeColor && isColorAcceptable(themeColor)) {
          this.background = themeColor;
          this.hasThemeColor = true;
        } else {
          this.background = store.theme.accentColor;
          this.hasThemeColor = false;
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

  public updateWindowTitle() {
    remote.getCurrentWindow().setTitle(`${this.title} - Wexond`);
  }

  @action
  public updateData() {
    if (this.lastHistoryId && !store.isIncognito) {
      const { title, url, favicon } = this;

      const item = store.history.getById(this.lastHistoryId);

      if (item) {
        item.title = title;
        item.url = url;
        item.favicon = favicon;
      }

      store.history.db.update(
        {
          _id: this.lastHistoryId,
        },
        {
          title,
          url,
          favicon,
        },
      );
    }
  }

  public get tabGroup() {
    return store.tabGroups.getGroupById(this.tabGroupId);
  }

  @action
  public select() {
    if (!this.isClosing) {
      store.overlay.isNewTab = this.url === 'about:blank';

      if (store.overlay.isNewTab) {
        store.overlay.visible = true;
      }

      this.tabGroup.selectedTabId = this.id;

      ipcRenderer.send(`permission-dialog-hide-${store.windowId}`);

      this.updateWindowTitle();

      const show = () => {
        if (this.isWindow) {
          ipcRenderer.send(`browserview-hide-${store.windowId}`);
          ipcRenderer.send(`select-window-${store.windowId}`, this.id);
        } else {
          ipcRenderer.send(`hide-window-${store.windowId}`);
          if (!store.overlay.isNewTab) {
            ipcRenderer.send(`browserview-show-${store.windowId}`);
          }
          ipcRenderer.send(`view-select-${store.windowId}`, this.id);
          ipcRenderer.send(
            `update-find-info-${store.windowId}`,
            this.id,
            this.findInfo,
          );
        }
      };

      if (store.overlay.visible && !store.overlay.isNewTab) {
        store.overlay.visible = false;
        setTimeout(show, store.settings.object.animations ? 200 : 0);
      } else {
        show();
      }

      requestAnimationFrame(() => {
        store.tabs.updateTabsBounds(true);
      });
    }
  }

  public getWidth(containerWidth: number = null, tabs: ITab[] = null) {
    if (containerWidth === null) {
      containerWidth = store.tabs.containerWidth;
    }

    if (this.isPinned) return TAB_PINNED_WIDTH;
    
    if (tabs === null) {
      tabs = store.tabs.list.filter(
        x => x.tabGroupId === this.tabGroupId && !x.isClosing,
      );
    }

    const width =
      containerWidth / (tabs.length + store.tabs.removedTabs) - TABS_PADDING;

    if (width > TAB_MAX_WIDTH) {
      return TAB_MAX_WIDTH;
    }
    if (width < TAB_MIN_WIDTH) {
      return TAB_MIN_WIDTH;
    }

    return width;
  }

  public getLeft(calcNewLeft: boolean = false) {
    const tabs = this.tabGroup.tabs.slice();

    const index = tabs.indexOf(this);

    let left = 0;
    for (let i = 0; i < index; i++) {
      left += (calcNewLeft ? this.getWidth() : tabs[i].width) + TABS_PADDING;
    }

    return left;
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
    const tabGroup = this.tabGroup;
    const { tabs } = tabGroup;

    store.tabs.closedUrl = this.url;

    const selected = tabGroup.selectedTabId === this.id;

    store.startupTabs.removeStartupTabItem(this.id, store.windowId);

    if (this.isWindow) {
      ipcRenderer.send(`detach-window-${store.windowId}`, this.id);
    } else {
      ipcRenderer.send(`view-destroy-${store.windowId}`, this.id);
    }

    const notClosingTabs = tabs.filter(x => !x.isClosing);
    let index = notClosingTabs.indexOf(this);

    store.tabs.resetRearrangeTabsTimer();

    this.isClosing = true;
    if (notClosingTabs.length - 1 === index) {
      const previousTab = tabs[index - 1];
      if (previousTab) {
        this.setLeft(previousTab.getLeft(true) + this.getWidth(), true);
      }
      store.tabs.updateTabsBounds(true);
    } else {
      store.tabs.removedTabs++;
    }

    this.setWidth(0, true);
    store.tabs.setTabsLefts(true);

    if (selected) {
      index = tabs.indexOf(this);

      if (
        index + 1 < tabs.length &&
        !tabs[index + 1].isClosing &&
        !store.tabs.scrollable
      ) {
        const nextTab = tabs[index + 1];
        nextTab.select();
      } else if (index - 1 >= 0 && !tabs[index - 1].isClosing) {
        const prevTab = tabs[index - 1];
        prevTab.select();
      }
    }

    if (this.tabGroup.tabs.length === 1) {
      store.overlay.isNewTab = true;
      store.overlay.visible = true;
    }

    this.removeTimeout = setTimeout(() => {
      store.tabs.removeTab(this.id);
    }, TAB_ANIMATION_DURATION * 1000);
  }

  public callViewMethod = (scope: string, ...args: any[]): Promise<any> => {
    return callViewMethod(store.windowId, this.id, scope, ...args);
  };
}
