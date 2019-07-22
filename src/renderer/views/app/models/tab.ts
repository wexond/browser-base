import { observable, computed, action } from 'mobx';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import Vibrant = require('node-vibrant');

import store from '../store';
import {
  TABS_PADDING,
  defaultTabOptions,
  TAB_ANIMATION_DURATION,
} from '../constants';
import { getColorBrightness, callViewMethod } from '~/utils';

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
  public background: string = store.theme.accentColor;

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

  constructor(
    { active, url } = defaultTabOptions,
    id: number,
    tabGroupId: number,
    isWindow: boolean,
  ) {
    this.url = url;
    this.id = id;
    this.isWindow = isWindow;
    this.tabGroupId = tabGroupId;

    if (active) {
      requestAnimationFrame(() => {
        this.select();
      });
    }

    if (isWindow) return;

    ipcRenderer.on(
      `view-url-updated-${this.id}`,
      async (e: any, url: string) => {
        if (url && url !== this.url) {
          this.lastHistoryId = await store.history.addItem({
            title: this.title,
            url,
            favicon: this.favicon,
            date: new Date().toString(),
          });
        }

        this.url = url;
        this.updateData();
      },
    );

    ipcRenderer.on(`view-title-updated-${this.id}`, (e: any, title: string) => {
      this.title = title === 'about:blank' ? 'New tab' : title;
      this.updateData();
    });

    ipcRenderer.on(
      `load-commit-${this.id}`,
      (
        e: any,
        event: any,
        url: string,
        isInPlace: boolean,
        isMainFrame: boolean,
      ) => {
        if (isMainFrame) {
          this.blockedAds = 0;
        }
      },
    );

    ipcRenderer.on(
      `browserview-favicon-updated-${this.id}`,
      async (e: any, favicon: string) => {
        try {
          this.favicon = favicon;

          let fav = favicon;
          if (favicon.startsWith('http')) {
            fav = await store.favicons.addFavicon(favicon);
          }
          const buf = Buffer.from(fav.split('base64,')[1], 'base64');

          if (!this.hasThemeColor) {
            const palette = await Vibrant.from(buf).getPalette();

            if (!palette.Vibrant) return;

            if (isColorAcceptable(palette.Vibrant.hex)) {
              this.background = palette.Vibrant.hex;
            } else {
              this.background = store.theme.accentColor;
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
      (e: any, themeColor: string) => {
        if (themeColor && isColorAcceptable(themeColor)) {
          this.background = themeColor;
          this.hasThemeColor = true;
        } else {
          this.background = store.theme.accentColor;
          this.hasThemeColor = false;
        }
      },
    );

    ipcRenderer.on(`view-loading-${this.id}`, (e: any, loading: boolean) => {
      this.loading = loading;
    });

    const { defaultBrowserActions, browserActions } = store.extensions;

    for (const item of defaultBrowserActions) {
      const browserAction = { ...item };
      browserAction.tabId = this.id;
      browserActions.push(browserAction);
    }
  }

  @action
  public updateData() {
    if (this.lastHistoryId) {
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

      ipcRenderer.send('permission-dialog-hide');

      const show = () => {
        if (this.isWindow) {
          ipcRenderer.send('browserview-hide');
          ipcRenderer.send('select-window', this.id);
        } else {
          ipcRenderer.send('hide-window');
          if (!store.overlay.isNewTab) {
            ipcRenderer.send('browserview-show');
          }
          ipcRenderer.send('view-select', this.id);
          ipcRenderer.send('update-find-info', this.id, this.findInfo);

          store.tabs.emitEvent('onActivated', {
            tabId: this.id,
            windowId: 0,
          });
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

    if (tabs === null) {
      tabs = store.tabs.list.filter(
        x => x.tabGroupId === this.tabGroupId && !x.isClosing,
      );
    }

    const width =
      containerWidth / (tabs.length + store.tabs.removedTabs) - TABS_PADDING;

    if (width > 200) {
      return 200;
    }
    if (width < 72) {
      return 72;
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

    if (this.isWindow) {
      ipcRenderer.send('detach-window', this.id);
    } else {
      ipcRenderer.send('view-destroy', this.id);
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

  callViewMethod = (scope: string, ...args: any[]): Promise<any> => {
    return callViewMethod(this.id, scope, ...args);
  };
}
