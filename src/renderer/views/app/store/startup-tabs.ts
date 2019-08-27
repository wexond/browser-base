import { observable, action } from 'mobx';
import * as React from 'react';
import { TweenLite } from 'gsap';
import Vibrant = require('node-vibrant');

import { ITab } from '../models';
import store from '.';
import { ipcRenderer, remote } from 'electron';
import { prefixHttp, isURL } from '~/utils';
import { defaultTabOptions } from '~/constants/tabs';
import { Database } from '~/models/database';
import { IStartupTab } from '~/interfaces/startup-tab';

export class StartupTabsStore {
  public db = new Database<IStartupTab>('startupTabs');

  public isLoaded: boolean = false;

  @observable
  public list: IStartupTab[] = [];

  public async load() {
    if (this.isLoaded) return;
    if (store === undefined || store.windowId > 1) return;
    this.isLoaded = true;
    let tabsToLoad: IStartupTab[] = [];
    if (store.settings.object.startupBehavior.type === 'continue') {
      tabsToLoad = await this.db.get({});
    } else if (store.settings.object.startupBehavior.type === 'urls') {
      tabsToLoad = await this.db.get({});
      tabsToLoad = tabsToLoad.filter(x => x.isUserDefined || x.pinned);
      this.list = tabsToLoad.filter(x => x.isUserDefined);
    } else {
      tabsToLoad = await this.db.get({ pinned: true });
    }

    let args = remote.process.argv;
    let needsNewTabPage = false;
    // If we have tabs saved, load them
    if (tabsToLoad && tabsToLoad.length > 0) {
      this.clearStartupTabs(true, false);

      let i = 0;
      for (let tab in tabsToLoad.sort((x, y) =>
        x.pinned && y.pinned
          ? x.order - y.order
          : x.pinned
          ? -1
          : y.pinned
          ? 1
          : x.order - y.order,
      )) {
        this.addTab({
          url: prefixHttp(tabsToLoad[tab].url),
          pinned: tabsToLoad[tab].pinned,
          active:
            i === tabsToLoad.length - 1 &&
            !(args.length > 1 && isURL(args[args.length - 1])),
        });
        i++;
      }

      // If we only load up pinned tabs, add a new tab page
      if (tabsToLoad.filter(x => !x.pinned).length == 0) {
        needsNewTabPage = true;
      }
    } else {
      // No tabs saved. Just load a new tab page.
      needsNewTabPage = true;
    }

    //load up command line args. If there are any, we don't need a new tab page.

    if (args.length > 1 && isURL(args[args.length - 1])) {
      this.addTab({
        url: prefixHttp(args[args.length - 1]),
        active: true,
      });
      needsNewTabPage = false;
    }

    if (needsNewTabPage) {
      this.addTab();
    }
  }

  @action
  public addTab(options = defaultTabOptions) {
    ipcRenderer.send(`view-create-${store.windowId}`, options);
  }

  public async addStartupTabItem(item: IStartupTab) {
    const itemToReplace = this.list.find(
      x => x.id === item.id && x.windowId === item.windowId,
    );
    if (itemToReplace) {
      this.db.update(itemToReplace, item);
      this.list[this.list.indexOf(itemToReplace)] = {
        ...itemToReplace,
        ...item,
      };
    } else {
      const doc = await this.db.insert(item);
      this.list.push(doc);
    }
  }

  public async addStartupDefaultTabItems(items: IStartupTab[]) {
    this.db.remove({ isUserDefined: true }, true);
    this.list = this.list.filter(x => !x.isUserDefined);
    items
      .filter(x => x.url !== undefined && x.url.length > 1)
      .forEach(async x => {
        this.list.push(await this.db.insert(x));
      });
  }

  public async updateStartupTabItem(tab: ITab) {
    this.addStartupTabItem({
      id: tab.id,
      windowId: store.windowId,
      url: tab.url,
      pinned: tab.isPinned,
      title: tab.title,
      favicon: tab.favicon,
      isUserDefined: false,
    });
  }

  public removeStartupTabItem(tabId: number, windowId: number) {
    const itemToDelete = this.list.find(
      x => x.id === tabId && x.windowId === windowId,
    );
    if (itemToDelete) {
      this.list = this.list.filter(
        x => x.id !== tabId || x.windowId !== windowId,
      );
      this.db.remove(itemToDelete);
    }
  }

  public clearStartupTabs(removePinned: boolean, removeUserDefined: boolean) {
    if (removePinned && removeUserDefined) {
      this.db.remove({}, true);
      this.list = [];
    } else if (!removePinned) {
      this.db.remove({ pinned: false }, true);
      this.list = this.list.filter(x => x.pinned);
    } else if (!removeUserDefined) {
      this.db.remove({ isUserDefined: false }, true);
      this.list = this.list.filter(x => x.isUserDefined);
    } else {
      this.db.remove({ isUserDefined: false, pinned: false }, true);
      this.list = this.list.filter(x => x.isUserDefined || x.pinned);
    }
  }
}
