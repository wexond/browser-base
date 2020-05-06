import { BrowserWindow } from 'electron';
import { EventEmitter } from 'events';
import { Extensions } from '.';
import { isBackgroundPage } from '../utils/web-contents';
import { WINDOW_ID_CURRENT } from '../constants';
import { sendToExtensionPages } from './background-pages';
import { HandlerFactory } from './handler-factory';

// Events which can be registered only once
interface IWindowsEvents {
  onCreateDetails: (
    window: BrowserWindow,
    details: chrome.windows.Window,
  ) => void;
  onBeforeFocusNextZOrder: (windowId: number) => number;
  onCreate: (details: chrome.windows.CreateData) => Promise<number>;
}

export declare interface WindowsAPI {
  on(event: 'focused', listener: (windowId: number) => void): this;
  on(event: 'created', listener: (window: chrome.windows.Window) => void): this;
  on(event: 'will-remove', listener: (windowId: number) => void): this;
  on(event: string, listener: Function): this;
}

export class WindowsAPI extends EventEmitter implements IWindowsEvents {
  private windows: Set<BrowserWindow> = new Set();

  private detailsCache: Map<BrowserWindow, chrome.windows.Window> = new Map();

  private lastFocused: BrowserWindow;

  constructor() {
    super();

    const handler = HandlerFactory.create('windows', this);

    handler('create', this.create);
    handler('update', this.update);
    handler('getAll', this.getAll);
    handler('getLastFocused', this.getLastFocused);

    handler('get', this.getHandler, true);
    handler('getCurrent', this.getCurrent, true);
  }

  onBeforeFocusNextZOrder: (windowId: number) => number;
  onCreateDetails: (
    window: BrowserWindow,
    details: chrome.windows.Window,
  ) => void;
  onCreate: (details: chrome.windows.CreateData) => Promise<number>;

  public update(windowId: number, updateInfo: chrome.windows.UpdateInfo) {
    const win = this.getWindowById(windowId);
    if (!win) return null;

    const { left, top, width, height, state } = updateInfo;

    if (!['minimized', 'maximized', 'fullscreen'].includes(state)) {
      const bounds = win.getBounds();
      const newBounds: Electron.Rectangle = { ...bounds };

      if (!isNaN(left)) newBounds.x = Math.floor(left);
      if (!isNaN(top)) newBounds.y = Math.floor(top);
      if (!isNaN(width) && width > 0) newBounds.width = Math.floor(width);
      if (!isNaN(height) && height > 0) newBounds.height = Math.floor(height);

      if (bounds !== newBounds) {
        win.setBounds(newBounds);
      }
    }

    if (typeof updateInfo.drawAttention === 'boolean') {
      win.flashFrame(updateInfo.drawAttention && !win.isFocused());
    }

    if (typeof updateInfo.focused === 'boolean') {
      if (updateInfo.focused) {
        if (state !== 'minimized') win.focus();
      } else if (
        this.onBeforeFocusNextZOrder &&
        !['fullscreen', 'maximized'].includes(state)
      ) {
        const windowIdToFocus = this.onBeforeFocusNextZOrder(windowId);
        this.focus(windowIdToFocus);
      }
    }

    if (state === 'minimized') win.minimize();
    else if (state === 'maximized') win.maximize();
    else if (state === 'fullscreen') win.setFullScreen(true);
    else if (state === 'normal') {
      if (win.isFullScreen()) win.setFullScreen(false);
      if (win.isMinimized()) win.restore();
      if (win.isMaximized()) win.unmaximize();
    }

    return this.createDetails(win);
  }

  public focus(windowId: number) {
    const win = this.getWindowById(windowId);
    win.focus();
  }

  public remove(windowId: number) {
    this.emit('will-remove', windowId);
  }

  public observe(window: BrowserWindow) {
    this.windows.add(window);

    window.once('closed', () => {
      this.windows.delete(window);
      this.onRemoved(window);
    });

    window.on('focus', () => {
      this.lastFocused = window;
    });

    this.onCreated(window);
  }

  public getWindowById(id: number) {
    return Array.from(this.windows).find((x) => x.id === id);
  }

  public async create(
    details: chrome.windows.CreateData,
  ): Promise<chrome.windows.Window> {
    if (!this.onCreate) {
      throw new Error('No onCreate event handler');
    }

    const id = await this.onCreate(details);
    const win = this.getWindowById(id);
    return this.getDetails(win);
  }

  public getLastFocused(
    getInfo: chrome.windows.GetInfo,
  ): chrome.windows.Window {
    return this.getDetailsMatchingGetInfo(this.lastFocused, getInfo);
  }

  public get(
    id: number,
    getInfo: chrome.windows.GetInfo,
  ): chrome.windows.Window {
    const win = this.getWindowById(id);
    return this.getDetailsMatchingGetInfo(win, getInfo);
  }

  public getAll(getInfo: chrome.windows.GetInfo): chrome.windows.Window[] {
    return Array.from(this.windows)
      .map((win) => this.getDetailsMatchingGetInfo(win, getInfo))
      .filter(Boolean);
  }

  private getHandler(
    event: Electron.IpcMainInvokeEvent,
    id: number,
    details: any,
  ) {
    return id === WINDOW_ID_CURRENT
      ? this.getCurrent(event, details)
      : this.get(id, details);
  }

  private getCurrent = (
    event: Electron.IpcMainInvokeEvent,
    getInfo: chrome.windows.GetInfo,
  ): chrome.windows.Window => {
    const tab = Extensions.instance.tabs.getTabById(event.sender.id);

    if (!tab) {
      if (isBackgroundPage(event.sender)) {
        return this.getDetailsMatchingGetInfo(this.lastFocused, getInfo);
      }
      return null;
    }

    const tabDetails = Extensions.instance.tabs.getDetails(tab);
    const win = this.getWindowById(tabDetails.windowId);

    return this.getDetailsMatchingGetInfo(win, getInfo);
  };

  private createDetails(win: BrowserWindow): chrome.windows.Window {
    const { x, y, width, height } = win.getBounds();

    let state = 'normal';

    if (win.isFullScreen()) state = 'fullscreen';
    else if (win.isMaximized()) state = 'maximized';
    else if (win.isMinimized()) state = 'minimized';

    const details: chrome.windows.Window = {
      id: win.id,
      focused: win.isFocused(),
      top: y,
      left: x,
      width,
      height,
      incognito: false,
      type: 'normal',
      state,
      alwaysOnTop: win.isAlwaysOnTop(),
    };

    if (this.onCreateDetails) this.onCreateDetails(win, details);

    this.detailsCache.set(win, details);

    return details;
  }

  private getDetails(win: BrowserWindow): chrome.windows.Window {
    if (!win) return null;

    if (this.detailsCache.has(win)) {
      return this.detailsCache.get(win);
    }

    return this.createDetails(win);
  }

  private getDetailsMatchingGetInfo = (
    win: BrowserWindow,
    getInfo: chrome.windows.GetInfo,
  ): chrome.windows.Window => {
    if (!win) return null;

    const details = this.getDetails(win);

    let windowTypes = getInfo?.windowTypes;

    if (!Array.isArray(windowTypes)) {
      windowTypes = ['normal', 'popup'];
    }

    if (!windowTypes.includes(details.type)) return null;

    if (getInfo?.populate === true) {
      return {
        ...details,
        tabs: Extensions.instance.tabs.query({ windowId: win.id }),
      };
    }

    return details;
  };

  private onRemoved(win: BrowserWindow) {
    this.emit('will-remove', win.id);
    sendToExtensionPages('windows.onRemoved', {
      windowId: win.id,
    });
  }

  private onCreated(win: BrowserWindow) {
    const details = this.getDetails(win);
    this.emit('created', details);
    sendToExtensionPages('windows.onCreated', details);
  }
}
