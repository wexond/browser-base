import { EventEmitter } from 'events';
import { join, dirname } from 'path';
import { format, parse } from 'url';
import { HandlerFactory } from '../handler-factory';
import { EXTENSION_PROTOCOL } from '~/common/constants/protocols';
import { Extensions } from '..';

type IconType = string | { [key: string]: string };

interface IBrowserActionInfo {
  icon?: IconType;
  popup?: string;
  title?: string;
  badgeText?: string;
  badgeBackgroundColor?: string | number[];
}

interface IBrowserAction extends IBrowserActionInfo {
  baseUrl: string;
  extensionId: string;
  tabs: Map<number, IBrowserActionInfo>;
}

const CHROME_DETAILS_KEYS: { [key: string]: string } = {
  badgeText: 'text',
  badgeBackgroundColor: 'color',
  title: 'title',
};

const resolvePath = (
  extensionUrl: string,
  path: string,
  scriptPath?: string,
) => {
  if (!path) return undefined;
  if (path.startsWith(extensionUrl)) return path;
  if (!scriptPath || path.startsWith('/')) scriptPath = './';
  return format({
    ...parse(extensionUrl),
    pathname: join(dirname(scriptPath), path).replace(/\\/g, '/'),
  });
};

const resolveIconPaths = (
  extensionUrl: string,
  icon: IconType,
  scriptPath?: string,
): IconType => {
  if (typeof icon === 'object') {
    const newIcon: IconType = {};
    Object.entries(icon).forEach(([key, value]) => {
      if (typeof value === 'string') {
        newIcon[key] = resolvePath(extensionUrl, value, scriptPath);
      }
    });
    return newIcon;
  }

  if (typeof icon === 'string') {
    return resolvePath(extensionUrl, icon, scriptPath);
  }

  return undefined;
};

export declare interface BrowserActionAPI {
  on(event: 'updated', listener: (action: IBrowserAction) => void): this;
  on(event: 'loaded', listener: (action: IBrowserAction) => void): this;
  on(event: string, listener: Function): this;
}

export class BrowserActionAPI extends EventEmitter {
  private sessionActionMap: Map<
    Electron.Session,
    Map<string, IBrowserAction>
  > = new Map();

  constructor() {
    super();

    const setter = (propName: string) => (
      session: Electron.Session,
      extensionId: string,
      details: chrome.browserAction.BadgeBackgroundColorDetails &
        chrome.browserAction.BadgeTextDetails &
        chrome.browserAction.TitleDetails &
        chrome.browserAction.PopupDetails &
        chrome.browserAction.TabIconDetails,
      scriptPath?: string,
    ) => {
      const action = this.getOrCreate(session, extensionId);
      const { tabId } = details;

      let newValue: any = (details as any)[CHROME_DETAILS_KEYS[propName]];

      if (propName === 'icon') {
        newValue =
          details.imageData ||
          resolveIconPaths(action.baseUrl, details.path, scriptPath);
      } else if (propName === 'popup') {
        newValue = resolvePath(action.baseUrl, details.popup, scriptPath);
      }

      let actionToUpdate: any = action;

      if (tabId) {
        if (action.tabs.has(tabId)) {
          actionToUpdate = action.tabs.get(tabId);
        } else {
          actionToUpdate = {};
          action.tabs.set(tabId, actionToUpdate);
        }
      }

      if (actionToUpdate[propName] !== newValue) {
        actionToUpdate[propName] = newValue;
        this.emit('updated', action);
      }
    };

    const handler = HandlerFactory.create('browserAction', this);

    [
      'title',
      'icon',
      'popup',
      'badgeBackgroundColor',
      'badgeText',
    ].forEach((prop) =>
      handler(
        `set${prop.charAt(0).toUpperCase()}${prop.substring(1)}`,
        setter(prop),
      ),
    );

    handler('getAll', this.getAllInSession);
    handler('getAllInTab', this.getAllInTab);
    // handler('onClicked', this.onClicked);
  }

  private getOrCreate(session: Electron.Session, extensionId: string) {
    let sessionActions = this.sessionActionMap.get(session);
    if (!sessionActions) {
      sessionActions = new Map();
      this.sessionActionMap.set(session, sessionActions);
    }

    let action = sessionActions.get(extensionId);
    if (!action) {
      action = {
        tabs: new Map(),
        extensionId,
        baseUrl: `${EXTENSION_PROTOCOL.scheme}${extensionId}/`,
      };
      sessionActions.set(extensionId, action);
    }

    return action;
  }

  public loadFromManifest(
    session: Electron.Session,
    extension: Electron.Extension,
  ): IBrowserAction {
    const { browser_action: browserAction } = extension.manifest || {};

    if (!browserAction) return null;

    const {
      default_popup: popup,
      default_title: title,
      default_icon: icon,
    } = browserAction;

    const action = this.getOrCreate(session, extension.id);
    Object.assign(action, {
      popup: resolvePath(extension.url, popup),
      icon: resolveIconPaths(extension.url, icon),
      title,
    });

    this.emit('loaded', action);

    return action;
  }

  public getAllInSession(session: Electron.Session): IBrowserAction[] {
    const sessionActions = this.sessionActionMap.get(session);
    if (!sessionActions) return [];
    return Array.from(sessionActions.values());
  }

  public getAllInTab(
    session: Electron.Session,
    tabId: number,
  ): IBrowserAction[] {
    const tab = Extensions.instance.tabs.getTabById(session, tabId);
    if (!tab) return [];

    const tabSession = tab.session;
    const actions = this.getAllInSession(tabSession);

    return actions.map((action) =>
      action.tabs.has(tabId)
        ? {
            ...action,
            ...action.tabs.get(tabId),
          }
        : action,
    );
  }

  // TODO(sentialx): Tab in callback, fire if the browser action has no popup.
  public onClicked(extensionId: string) {
    this.emit('clicked', extensionId);
  }
}
