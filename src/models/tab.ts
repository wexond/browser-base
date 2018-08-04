import { observable } from 'mobx';
import { TweenLite } from 'gsap';

import { Workspace } from '.';
import {
  TAB_MAX_WIDTH, TAB_PINNED_WIDTH, TAB_MIN_WIDTH, TOOLBAR_HEIGHT,
} from '../constants';
import { tabAnimations } from '../defaults';
import store from '../renderer/store';

let nextTabId = 0;

export class Tab {
  @observable
  public id = -1;

  @observable
  public title = 'New tab';

  @observable
  public pinned = false;

  @observable
  public isRemoving = false;

  @observable
  public hovered = false;

  @observable
  public dragging = false;

  @observable
  public favicon = '';

  @observable
  public loading = false;

  @observable
  public url = '';

  @observable
  public isNew = true;

  public left = 0;

  public width = 0;

  public tab: HTMLDivElement;

  public workspace: Workspace;

  constructor(workspace: Workspace) {
    this.id = nextTabId++;
    this.workspace = workspace;
  }

  public getInitialWidth(): number {
    const newTabs = this.workspace.tabs.filter(tab => !tab.isRemoving);
    const containerWidth = this.workspace.getContainerWidth();

    let width: number = this.pinned ? TAB_PINNED_WIDTH : containerWidth / newTabs.length;

    if (width > TAB_MAX_WIDTH) {
      width = TAB_MAX_WIDTH;
    }

    return width;
  }

  public getWidth(): number {
    let width = this.getInitialWidth();

    if (!this.pinned && width < TAB_MIN_WIDTH) {
      width = TAB_MIN_WIDTH;
    }

    return width;
  }

  public getNewLeft(): number {
    const newTabs = this.workspace.tabs.filter(tab => !tab.isRemoving);

    let position = 0;
    for (let i = 0; i < newTabs.indexOf(this); i++) {
      position += newTabs[i].getWidth();
    }
    return position;
  }

  public getLeft(): number {
    const newTabs = this.workspace.tabs.filter(tab => !tab.isRemoving);

    let position = 0;
    for (let i = 0; i < newTabs.indexOf(this); i++) {
      position += newTabs[i].width;
    }
    return position;
  }

  public setLeft(left: number, animation = false) {
    if (animation) {
      TweenLite.to(this.tab, tabAnimations.left.duration, {
        x: left,
        ease: tabAnimations.left.easing,
      });
    } else {
      TweenLite.to(this.tab, 0, {
        x: left,
      });
    }

    this.left = left;
  }

  public setWidth(width: number, animation = false) {
    if (animation) {
      TweenLite.to(this.tab, tabAnimations.width.duration, {
        width,
        ease: tabAnimations.width.easing,
      });
    } else {
      this.tab.style.width = `${width}px`;
    }

    this.width = width;
  }

  public getIpcTab(): chrome.tabs.Tab {
    const selected = store.getCurrentWorkspace().selectedTab === this.id;

    return {
      id: this.id,
      index: this.workspace.tabs.indexOf(this),
      title: this.title,
      pinned: this.pinned,
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
