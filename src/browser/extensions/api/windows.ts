import { BrowserWindow, session } from 'electron';
import { EventEmitter } from 'events';
import { Extensions } from '../';
import { isBackgroundPage } from '../web-contents';
import { sendToExtensionPages } from '../background-pages';
import { HandlerFactory } from '../handler-factory';
import { WINDOW_ID_CURRENT } from '~/common/extensions/constants';
import { WEBUI_BASE_URL } from '~/common/constants/protocols';

// Events which can be registered only once
interface IWindowsEvents {
  onCreateDetails: (
    window: BrowserWindow,
    details: chrome.windows.Window,
  ) => void;
  onBeforeFocusNextZOrder: (windowId: number) => number;
  onCreate: (
    session: Electron.Session,
    details: chrome.windows.CreateData,
  ) => Promise<number>;
}

export declare interface WindowsAPI {
  on(event: 'focused', listener: (windowId: number) => void): this;
  on(event: 'created', listener: (window: chrome.windows.Window) => void): this;
  on(event: 'will-remove', listener: (windowId: number) => void): this;
  on(event: 'removed', listener: (windowId: number) => void): this;
  on(event: string, listener: Function): this;
}

interface ISessionInfo {
  lastFocused?: BrowserWindow;
  windows?: Map<number, BrowserWindow>;
}

export class WindowsAPI extends EventEmitter implements IWindowsEvents {
  private detailsCache: Map<BrowserWindow, chrome.windows.Window> = new Map();

  private sessionsInfo: Map<Electron.Session, ISessionInfo> = new Map();

  constructor() {
    super();

    const handler = HandlerFactory.create('windows', this);

    handler('create', this.create);
    handler('update', this.update);
    handler('getAll', this.getAll);
    handler('getLastFocused', this.getLastFocused);
    handler('remove', this.remove);

    handler('get', this.getHandler, { sender: true });
    handler('getCurrent', this.getCurrent, { sender: true });
  }

  onBeforeFocusNextZOrder: (windowId: number) => number;
  onCreateDetails: (
    window: BrowserWindow,
    details: chrome.windows.Window,
  ) => void;
  onCreate: (
    session: Electron.Session,
    details: chrome.windows.CreateData,
  ) => Promise<number>;

  public update(
    session: Electron.Session,
    windowId: number,
    updateInfo: chrome.windows.UpdateInfo,
  ) {
    const win = this.getWindowById(session, windowId);
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
        this.focus(session, windowIdToFocus);
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

  public focus(session: Electron.Session, windowId: number) {
    this.getWindowById(session, windowId)?.focus();
  }

  public remove(session: Electron.Session, windowId: number) {
    if (!this.getWindowById(session, windowId)) return;
    this.emit('will-remove', windowId);
  }

  public observe(window: BrowserWindow, senderSession: Electron.Session) {
    let sessionInfo = this.sessionsInfo.get(senderSession);
    if (!sessionInfo) {
      sessionInfo = {
        windows: new Map(),
      };
      this.sessionsInfo.set(senderSession, sessionInfo);
    }

    if (sessionInfo.windows?.has(window.id)) return;

    HandlerFactory.uiToSenderSession.set(
      window.webContents.session,
      senderSession,
    );
    sessionInfo.windows.set(window.id, window);

    window.once('closed', () => {
      sessionInfo.windows.delete(window.id);
      this.onRemoved(window);
    });

    window.on('focus', () => {
      sessionInfo.lastFocused = window;
    });

    this.onCreated(window);
  }

  public getWindowById(session: Electron.Session, id: number) {
    return this.sessionsInfo.get(session)?.windows?.get(id);
  }

  public async create(
    senderSession: Electron.Session,
    details: chrome.windows.CreateData,
  ): Promise<chrome.windows.Window> {
    if (!this.onCreate) {
      throw new Error('No onCreate event handler');
    }

    const id = await this.onCreate(senderSession, details);
    const win = BrowserWindow.fromId(id);

    this.observe(win, senderSession);

    return this.getDetails(this.getWindowById(senderSession, id));
  }

  public getLastFocused(
    session: Electron.Session,
    getInfo?: chrome.windows.GetInfo,
  ): chrome.windows.Window {
    const info = this.sessionsInfo.get(session);
    if (!info) return null;
    return this.getDetailsMatchingGetInfo(session, info.lastFocused, getInfo);
  }

  public get(
    session: Electron.Session,
    id: number,
    getInfo?: chrome.windows.GetInfo,
  ): chrome.windows.Window {
    const win = this.getWindowById(session, id);
    return this.getDetailsMatchingGetInfo(session, win, getInfo);
  }

  public getAll(
    session: Electron.Session,
    getInfo?: chrome.windows.GetInfo,
  ): chrome.windows.Window[] {
    return Object.values(this.sessionsInfo.get(session).windows)
      .map((win) => this.getDetailsMatchingGetInfo(session, win, getInfo))
      .filter(Boolean);
  }

  private getHandler(
    session: Electron.Session,
    sender: Electron.WebContents,
    id: number,
    details: any,
  ) {
    return id === WINDOW_ID_CURRENT
      ? this.getCurrent(session, sender, details)
      : this.get(session, id, details);
  }

  public getCurrent = (
    session: Electron.Session,
    sender: Electron.WebContents,
    getInfo?: chrome.windows.GetInfo,
  ): chrome.windows.Window => {
    if (sender.getURL().startsWith(WEBUI_BASE_URL)) {
      const win = BrowserWindow.fromWebContents(sender);
      if (win) {
        return this.getDetailsMatchingGetInfo(session, win, getInfo);
      }
    }

    const tab = Extensions.instance.tabs.getTabById(session, sender.id);

    if (!tab) {
      const info = this.sessionsInfo.get(session);
      if (isBackgroundPage(sender) && info) {
        return this.getDetailsMatchingGetInfo(
          session,
          info.lastFocused,
          getInfo,
        );
      }
      return null;
    }

    const tabDetails = Extensions.instance.tabs.getDetails(tab);
    return this.getDetailsMatchingGetInfo(
      session,
      this.getWindowById(session, tabDetails.windowId),
      getInfo,
    );
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
    session: Electron.Session,
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
        tabs: Extensions.instance.tabs.query(session, { windowId: win.id }),
      };
    }

    return details;
  };

  private onRemoved(win: BrowserWindow) {
    this.emit('removed', win.id);
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
