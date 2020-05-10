import { BrowserWindow, WebContents, webContents, session } from 'electron';
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
  onCreate: (
    session: Electron.Session,
    details: chrome.tabs.CreateProperties,
  ) => Promise<number>;
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
  on(
    event: 'will-remove',
    listener: (tabId: number, windowId: number) => void,
  ): this;
  on(
    event: 'removed',
    listener: (tabId: number, removedInfo: chrome.tabs.TabRemoveInfo) => void,
  ): this;
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
    handler('remove', this.remove);
    handler('insertCSS', this.insertCSS);

    handler('create', this.createHandler, { sender: true });
    handler('getCurrent', this.getCurrent, { sender: true });
  }

  onCreateDetails: (tab: Tab, details: chrome.tabs.Tab) => void;
  onCreate: (
    session: Electron.Session,
    details: chrome.tabs.CreateProperties,
  ) => Promise<number>;

  public async update(
    session: Electron.Session,
    tabId: number,
    updateProperties: chrome.tabs.UpdateProperties,
  ) {
    const tab = this.getTabById(session, tabId);
    if (!tab) return null;

    const { url, muted, active } = updateProperties;

    // TODO: validate URL, prevent 'javascript:'
    if (url) await tab.loadURL(url);

    if (typeof muted === 'boolean') tab.setAudioMuted(muted);

    if (active) this.activate(session, tabId);

    this.onUpdated(tab);

    return this.createDetails(tab);
  }

  public activate(
    session: Electron.Session,
    tabId: number,
    ...additionalArgs: any[]
  ) {
    const tab = this.getTabById(session, tabId);
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

  public get(session: Electron.Session, tabId: number): chrome.tabs.Tab {
    const tab = this.getTabById(session, tabId);
    return this.getDetails(tab);
  }

  public remove(session: Electron.Session, tabIds: number | number[]) {
    const removeTab = (id: number) => {
      const tab = this.getTabById(session, id);
      if (!tab) return;

      const details = this.detailsCache.get(tab);
      const windowId = details ? details.windowId : -1;

      this.emit('will-remove', id, windowId);
    };

    if (Array.isArray(tabIds)) {
      tabIds.forEach((id) => removeTab(id));
      return;
    }

    removeTab(tabIds);
  }

  // This API is deprecated, so we fallback it to chrome.tabs.query({ windowId })
  public getAllInWindow(session: Electron.Session, windowId: number) {
    return this.query(session, { windowId });
  }

  // Deprecated, fallback to chrome.tabs.query
  public getSelected(
    session: Electron.Session,
    sender: Electron.WebContents,
    windowId?: number,
  ) {
    let window: chrome.windows.Window;

    if (typeof windowId === 'number') {
      window = Extensions.instance.windows.get(session, windowId);
      return this.query(session, { windowId, active: true })?.[0];
    } else {
      window = Extensions.instance.windows.getCurrent(session, sender);
    }

    if (!window) return null;

    return this.query(session, {
      windowId: window.id,
      active: true,
    })?.[0];
  }

  public query(session: Electron.Session, info: chrome.tabs.QueryInfo = {}) {
    const isSet = (value: any) => typeof value !== 'undefined';

    const tabs = Array.from(this.tabs)
      .filter((tab) => tab.session === session)
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
      .sort((a, b) => a.index - b.index);

    return tabs;
  }

  public async createHandler(
    session: Electron.Session,
    sender: Electron.WebContents,
    details: chrome.tabs.CreateProperties,
  ) {
    if (!details.windowId) {
      details.windowId = Extensions.instance.windows.getCurrent(
        session,
        sender,
      ).id;
    }
    this.create(session, details);
  }

  public async create(
    ses: Electron.Session,
    details: chrome.tabs.CreateProperties,
  ): Promise<chrome.tabs.Tab> {
    if (!details.windowId) {
      throw new Error('windowId not specified');
    }

    if (!this.onCreate) {
      throw new Error('No onCreate event handler');
    }

    const window = Extensions.instance.windows.get(ses, details.windowId, {
      populate: true,
    });

    const tabId = await this.onCreate(
      BrowserWindow.fromId(details.windowId).webContents.session,
      details,
    );
    const tab: Tab = webContents.fromId(tabId);

    tab.windowId = details.windowId;

    const tabDetails = this.getDetails(tab);

    if (!details.index || details.index > window.tabs.length) {
      tabDetails.index = window.tabs.length;
    } else {
      const tab = window.tabs.find((x) => x.index === details.index);
      if (tab) tab.index = details.index + 1;

      for (let i = details.index; i < window.tabs.length; i++) {
        window.tabs[i].index++;
      }

      tabDetails.index = details.index;
    }

    this.observe(tab);

    if (details.active) this.activate(ses, tabId);

    return tabDetails;
  }

  public observe(tab: Tab) {
    this.tabs.add(tab);

    const { session } = tab;

    tab.once('destroyed', () => {
      this.tabs.delete(tab);
      this.onRemoved(session, tab);
    });

    const updateEvents: any[] = [
      'page-title-updated', // title
      'did-start-loading', // status
      'did-stop-loading', // status
      'did-start-navigation', // url
      'did-redirect-navigation', // url
      'did-navigate-in-page', // url
    ];

    updateEvents.forEach((eventName) => {
      tab.on(eventName, () => {
        this.onUpdated(tab);
      });
    });

    tab.on('media-started-playing', () => {
      tab.audible = true;
      this.onUpdated(tab);
    });

    tab.on('media-paused', () => {
      tab.audible = false;
      this.onUpdated(tab);
    });

    tab.on('page-favicon-updated', (event, favicons) => {
      tab.favicon = favicons[0];
      this.onUpdated(tab);
    });

    this.onCreated(tab);
  }

  public reload(
    session: Electron.Session,
    tabId: number,
    reloadProperties: chrome.tabs.ReloadProperties = {},
  ) {
    const tab = this.getTabById(session, tabId);
    if (!tab) return;

    if (reloadProperties.bypassCache) {
      tab.reloadIgnoringCache();
    } else {
      tab.reload();
    }
  }

  public getTabById(session: Electron.Session, id: number) {
    return Array.from(this.tabs).find(
      (x) => x.id === id && x.session === session,
    );
  }

  public getDetails = (tab: Tab): chrome.tabs.Tab => {
    if (!tab) return null;

    if (this.detailsCache.has(tab)) {
      return this.detailsCache.get(tab);
    }

    return this.createDetails(tab);
  };

  private getCurrent(session: Electron.Session, sender: Electron.WebContents) {
    const tab = this.getTabById(session, sender.id);
    if (!tab) return null;

    return this.getDetails(tab);
  }

  public async insertCSS(
    session: Electron.Session,
    extensionId: string,
    tabId: number,
    details: chrome.tabs.InjectDetails,
  ) {
    const tab = this.getTabById(session, tabId);
    if (!tab) return;

    if (details.hasOwnProperty('file')) {
      details.code = await promises.readFile(
        resolve(session.getExtension(extensionId).path, details.file),
        'utf8',
      );
    }

    tab.insertCSS(details.code, {
      cssOrigin: details.cssOrigin,
    });
  }

  private createDetails(tab: Tab): chrome.tabs.Tab {
    if (tab.isDestroyed()) return null;

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

    const window =
      (tab.windowId > 0 && BrowserWindow.fromId(tab.windowId)) ||
      getParentWindowOfTab(tab);
    const [width = 0, height = 0] = window ? window.getSize() : [];

    const details: chrome.tabs.Tab = {
      ...(prevDetails as chrome.tabs.Tab),
      audible: tab.audible,
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

  private onRemoved(session: Electron.Session, tab: Tab) {
    const details = this.detailsCache.get(tab);
    if (!details) return;

    this.detailsCache.delete(tab);

    const { windowId } = details;
    const win = Extensions.instance.windows.getWindowById(session, windowId);

    const windowDetails = Extensions.instance.windows.get(session, windowId, {
      populate: true,
    });

    if (windowDetails) {
      for (let i = details.index; i < windowDetails.tabs.length; i++) {
        if (!windowDetails.tabs[i]) continue;
        windowDetails.tabs[i].index--;
      }
    }

    const args = [
      details.id,
      {
        windowId,
        isWindowClosing: win ? win.isDestroyed() : false,
      },
    ];

    this.emit('removed', ...args);
    sendToExtensionPages('tabs.onRemoved', ...args);
  }

  private onCreated(tab: Tab) {
    const details = this.getDetails(tab);
    sendToExtensionPages('tabs.onCreated', details);
  }
}
