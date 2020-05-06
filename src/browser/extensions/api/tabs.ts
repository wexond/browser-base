import { BrowserWindow } from 'electron';
import { promises } from 'fs';
import { resolve } from 'path';
import { sessionFromIpcEvent } from '../session';
import { sendToExtensionPages } from '../background-pages';
import { EventEmitter } from 'events';
import { Extensions } from '../';
import { HandlerFactory } from '../handler-factory';
import { Tab } from '~/common/extensions/interfaces/tabs';

export const getParentWindowOfTab = (tab: Tab) => {
  switch (tab.getType()) {
    case 'window':
      return BrowserWindow.fromWebContents(tab);
    case 'browserView':
    case 'webview':
      return (tab as any).getOwnerBrowserWindow();
  }
  return undefined;
};

// Events which can be registered only once
interface ITabsEvents {
  onCreateDetails: (tab: Tab, details: chrome.tabs.Tab) => void;
  onCreate: (details: chrome.tabs.CreateProperties) => Promise<number>;
}

export declare interface TabsAPI {
  on(
    event: 'updated',
    listener: (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      details: chrome.tabs.Tab,
    ) => void,
  ): this;
  on(
    event: 'activated',
    listener: (
      tabId: number,
      windowId: number,
      ...additionalArgs: any[]
    ) => void,
  ): this;
  on(event: 'will-remove', listener: (tabId: number) => void): this;
  on(event: string, listener: Function): this;
}

type DetailsType = chrome.tabs.Tab & { [key: string]: string };

export class TabsAPI extends EventEmitter implements ITabsEvents {
  private tabs: Set<Tab> = new Set();
  private detailsCache: Map<Tab, chrome.tabs.Tab> = new Map();

  constructor() {
    super();

    const handler = HandlerFactory.create('tabs', this);

    handler('get', this.get);
    handler('getSelected', this.getSelected);
    handler('getAllInWindow', this.getAllInWindow);
    handler('query', this.query);
    handler('update', this.update);
    handler('reload', this.reload);
    handler('create', this.create);
    handler('remove', this.remove);

    handler('getCurrent', this.getCurrent, true);
    handler('insertCSS', this.insertCSS, true);
  }

  onCreateDetails: (tab: Tab, details: chrome.tabs.Tab) => void;
  onCreate: (details: chrome.tabs.CreateProperties) => Promise<number>;

  public async update(
    tabId: number,
    updateProperties: chrome.tabs.UpdateProperties,
  ) {
    const tab = this.getTabById(tabId);
    if (!tab) return null;

    const { url, muted, active } = updateProperties;

    // TODO: validate URL, prevent 'javascript:'
    if (url) await tab.loadURL(url);

    if (typeof muted === 'boolean') tab.setAudioMuted(muted);

    if (active) this.activate(tabId);

    this.onUpdated(tab);

    return this.createDetails(tab);
  }

  public activate(tabId: number, ...additionalArgs: any[]) {
    const tab = this.getTabById(tabId);
    if (!tab) return;

    const details = this.getDetails(tab);

    const activeChanged = !details.active;

    this.detailsCache.forEach((tabInfo, cacheTab) => {
      tabInfo.active = tabId === cacheTab.id;
    });

    if (!activeChanged) return;

    this.emit('activated', tab.id, details.windowId, ...additionalArgs);
    sendToExtensionPages('tabs.onActivated', {
      tabId,
      windowId: details.windowId,
    });
  }

  public get(tabId: number): chrome.tabs.Tab {
    const tab = this.getTabById(tabId);
    return this.getDetails(tab);
  }

  public remove(tabIds: number | number[]) {
    if (Array.isArray(tabIds)) {
      tabIds.forEach((id) => this.emit('will-remove', id));
      return;
    }

    this.emit('will-remove', tabIds);
  }

  // This API is deprecated, so we fallback it to chrome.tabs.query({ windowId })
  public getAllInWindow(windowId: number) {
    return this.query({ windowId });
  }

  // Deprecated, fallback to chrome.tabs.query
  public getSelected(windowId: number) {
    if (typeof windowId === 'number') {
      return this.query({ windowId, active: true });
    }
    return this.query({ active: true });
  }

  public query(info: chrome.tabs.QueryInfo = {}) {
    const isSet = (value: any) => typeof value !== 'undefined';

    const tabs = Array.from(this.tabs)
      .map(this.getDetails)
      .filter((tab) => {
        if (isSet(info.active) && info.active !== tab.active) return false;
        if (isSet(info.pinned) && info.pinned !== tab.pinned) return false;
        if (isSet(info.audible) && info.audible !== tab.audible) return false;
        if (isSet(info.muted) && info.muted !== tab.mutedInfo.muted)
          return false;
        if (isSet(info.highlighted) && info.highlighted !== tab.highlighted)
          return false;
        if (isSet(info.discarded) && info.discarded !== tab.discarded)
          return false;
        if (
          isSet(info.autoDiscardable) &&
          info.autoDiscardable !== tab.autoDiscardable
        )
          return false;
        if (isSet(info.status) && info.status !== tab.status) return false;
        if (isSet(info.windowId) && info.windowId !== tab.windowId)
          return false;
        if (isSet(info.title) && info.title !== tab.title) return false; // TODO: pattern match
        if (
          isSet(info.url) &&
          info.url !== tab.url &&
          info.url !== '<all_urls>'
        )
          return false; // TODO: match URL pattern
        // if (isSet(info.currentWindow)) return false
        // if (isSet(info.lastFocusedWindow)) return false
        // if (isSet(info.windowType) && info.windowType !== tab.windowType) return false
        // if (isSet(info.index) && info.index !== tab.index) return false
        return true;
      })
      .map((tab, index) => {
        tab.index = index;
        return tab;
      });

    return tabs;
  }

  public async create(
    details: chrome.tabs.CreateProperties,
  ): Promise<chrome.tabs.Tab> {
    if (!this.onCreate) {
      throw new Error('No onCreate event handler');
    }

    const tabId = await this.onCreate(details);
    const tab = this.getTabById(tabId);
    return this.getDetails(tab);
  }

  public observe(tab: Tab) {
    this.tabs.add(tab);

    tab.once('destroyed', () => {
      this.tabs.delete(tab);
      this.onRemoved(tab);
    });

    const updateEvents: any[] = [
      'page-title-updated', // title
      'did-start-loading', // status
      'did-stop-loading', // status
      'media-started-playing', // audible
      'media-paused', // audible
      'did-start-navigation', // url
      'did-redirect-navigation', // url
      'did-navigate-in-page', // url
    ];

    updateEvents.forEach((eventName) => {
      tab.on(eventName, () => {
        this.onUpdated(tab);
      });
    });

    tab.on('page-favicon-updated', (event, favicons) => {
      tab.favicon = favicons[0];
      this.onUpdated(tab);
    });

    this.onCreated(tab);
  }

  public reload(
    tabId: number,
    reloadProperties: chrome.tabs.ReloadProperties = {},
  ) {
    const tab = this.getTabById(tabId);
    if (!tab) return;

    if (reloadProperties.bypassCache) {
      tab.reloadIgnoringCache();
    } else {
      tab.reload();
    }
  }

  public getTabById(id: number) {
    return Array.from(this.tabs).find((x) => x.id === id);
  }

  public getDetails = (tab: Tab): chrome.tabs.Tab => {
    if (!tab) return null;

    if (this.detailsCache.has(tab)) {
      return this.detailsCache.get(tab);
    }

    return this.createDetails(tab);
  };

  private getCurrent(e: Electron.IpcMainInvokeEvent) {
    const tab = this.getTabById(e.sender.id);
    if (!tab) return null;

    return this.getDetails(tab);
  }

  private async insertCSS(
    e: Electron.IpcMainEvent,
    extensionId: string,
    tabId: number,
    details: chrome.tabs.InjectDetails,
  ) {
    const tab = this.getTabById(tabId);
    if (!tab) return;

    if (details.hasOwnProperty('file')) {
      const ses = sessionFromIpcEvent(e);
      details.code = await promises.readFile(
        resolve(ses.getExtension(extensionId).path, details.file),
        'utf8',
      );
    }

    tab.insertCSS(details.code, {
      cssOrigin: details.cssOrigin,
    });
  }

  private createDetails(tab: Tab): chrome.tabs.Tab {
    const window = getParentWindowOfTab(tab);
    const [width = 0, height = 0] = window ? window.getSize() : [];

    const prevDetails: Partial<chrome.tabs.Tab> = this.detailsCache.get(
      tab,
    ) || {
      id: tab.id,
      active: false,
      highlighted: false,
      selected: false,
      autoDiscardable: true,
      discarded: false,
      incognito: false,
      index: 0,
      pinned: false,
    };

    const details: chrome.tabs.Tab = {
      ...(prevDetails as chrome.tabs.Tab),
      audible: tab.isCurrentlyAudible(),
      favIconUrl: tab.favicon || undefined,
      height,
      width,
      mutedInfo: { muted: tab.audioMuted },
      status: tab.isLoading() ? 'loading' : 'complete',
      title: tab.getTitle(),
      url: tab.getURL(),
      windowId: window ? window.id : -1,
    };

    if (this.onCreateDetails) this.onCreateDetails(tab, details);

    this.detailsCache.set(tab, details);

    return details;
  }

  private onUpdated(tab: Tab) {
    if (!tab) return;

    const prevDetails: DetailsType = this.detailsCache.get(tab) as any;
    if (!prevDetails) return;

    const details: DetailsType = this.createDetails(tab) as any;

    const compareProps = [
      'status',
      'url',
      'pinned',
      'audible',
      'discarded',
      'autoDiscardable',
      'mutedInfo',
      'favIconUrl',
      'title',
    ];

    let didUpdate = false;
    const changeInfo: any = {};

    for (const prop of compareProps) {
      if (details[prop] !== prevDetails[prop]) {
        changeInfo[prop] = details[prop];
        didUpdate = true;
      }
    }

    if (!didUpdate) return;

    this.emit('updated', tab.id, changeInfo, details);
    sendToExtensionPages('tabs.onUpdated', tab.id, changeInfo, details);
  }

  private onRemoved(tab: Tab) {
    const details = this.detailsCache.has(tab)
      ? this.detailsCache.get(tab)
      : null;

    this.detailsCache.delete(tab);

    const windowId = details ? details.windowId : -1;
    const win = Extensions.instance.windows.getWindowById(windowId);

    sendToExtensionPages('tabs.onRemoved', tab.id, {
      windowId,
      isWindowClosing: win ? win.isDestroyed() : false,
    });
  }

  private onCreated(tab: Tab) {
    const details = this.getDetails(tab);
    sendToExtensionPages('tabs.onCreated', details);
  }
}
