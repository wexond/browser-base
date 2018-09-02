import { observable, computed } from 'mobx';
import { TabGroup } from './tab-group';
import store from '@app/store';
import { TABS_PADDING, TOOLBAR_HEIGHT } from '~/constants/app';

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

  public ref: HTMLDivElement;

  constructor(tabGroup: TabGroup) {
    const { defaultBrowserActions, browserActions } = store.extensionsStore;

    this.tabGroup = tabGroup;

    for (const item of defaultBrowserActions) {
      const browserAction = { ...item };
      browserAction.tabId = this.id;
      browserActions.push(browserAction);
    }
  }

  public select() {
    if (!this.isClosing) {
      this.tabGroup.selectedTab = this.id;

      store.extensionsStore.emitEvent('tabs', 'onActivated', {
        tabId: this.id,
        windowId: 0,
      });

      store.tabsStore.selectedTab = this.id;
    }
  }

  public getWidth() {
    const tabs = this.tabGroup.tabs.filter(x => !x.isClosing);
    const width =
      store.tabsStore.getContainerWidth() / tabs.length - TABS_PADDING;

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
    store.tabsStore.animateProperty('x', this.ref, left, animation);
    this.left = left;
  }

  public setWidth(width: number, animation: boolean) {
    store.tabsStore.animateProperty('width', this.ref, width, animation);
    this.width = width;
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
