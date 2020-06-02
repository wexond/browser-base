import { EventEmitter } from 'events';
import { join, dirname, resolve } from 'path';
import { format, parse } from 'url';
import { HandlerFactory, ISenderDetails } from '../handler-factory';
import { fromBuffer } from 'file-type';
import { Extensions } from '..';
import {
  IconType,
  IBrowserAction,
} from '~/common/extensions/interfaces/browser-action';
import { promises } from 'fs';

const CHROME_DETAILS_KEYS: { [key: string]: string } = {
  badgeText: 'text',
  badgeBackgroundColor: 'color',
  title: 'title',
};

const resolveUrl = (extensionUrl: string, path: string) => {
  if (!path) return undefined;
  if (path.startsWith(extensionUrl)) return path;
  return format({
    ...parse(extensionUrl),
    pathname: path,
  });
};

const resolvePath = (path: string, scriptPath?: string) => {
  if (!path) return undefined;
  if (!scriptPath || path.startsWith('/') || path.startsWith('.')) {
    scriptPath = './';
    path = path.replace(/^(?:\.\.\/)+/, '');
  }
  return join(dirname(scriptPath), path).replace(/\\/g, '/');
};

const getIconBase64 = async (
  path: string,
  basePath: string,
  scriptPath?: string,
) => {
  const buffer = await promises.readFile(
    resolve(basePath, resolvePath(path, scriptPath)),
  );

  const type = await fromBuffer(buffer);

  return `data:image/${type.ext};base64,${buffer.toString('base64')}`;
};

const getIconsBase64 = async (
  icon: IconType,
  basePath: string,
  scriptPath?: string,
): Promise<IconType> => {
  if (typeof icon === 'object') {
    const newIcon: IconType = {};
    for (const [key, value] of Object.entries(icon)) {
      if (typeof value === 'string') {
        newIcon[key] = await getIconBase64(value, basePath, scriptPath);
      }
    }

    return newIcon;
  }

  if (typeof icon === 'string') {
    return await getIconBase64(icon, basePath, scriptPath);
  }

  return undefined;
};

const getActionForTab = (action: IBrowserAction, tabId: number) =>
  action?.tabs?.has?.(tabId)
    ? {
        ...action,
        ...action.tabs.get(tabId),
      }
    : action;

export declare interface BrowserActionAPI {
  on(
    event: 'updated',
    listener: (session: Electron.Session, action: IBrowserAction) => void,
  ): this;
  on(
    event: 'loaded',
    listener: (session: Electron.Session, action: IBrowserAction) => void,
  ): this;
  on(event: string, listener: Function): this;
}

export class BrowserActionAPI extends EventEmitter {
  public sessionActionMap: Map<
    Electron.Session,
    Map<string, IBrowserAction>
  > = new Map();

  constructor() {
    super();

    const setter = (propName: string) => async (
      { session, extensionId, scriptPath }: ISenderDetails,
      {
        details,
      }: {
        details: chrome.browserAction.BadgeBackgroundColorDetails &
          chrome.browserAction.BadgeTextDetails &
          chrome.browserAction.TitleDetails &
          chrome.browserAction.PopupDetails &
          chrome.browserAction.TabIconDetails;
      },
    ) => {
      const action = this.getOrCreate(session, extensionId);
      const extension = session.getExtension(action.extensionId);
      const { tabId } = details;

      let newValue: any = (details as any)[CHROME_DETAILS_KEYS[propName]];

      if (propName === 'icon') {
        newValue =
          details.imageData ||
          (await getIconsBase64(details.path, extension.path, scriptPath));
      } else if (propName === 'popup') {
        newValue = resolveUrl(
          extension.url,
          resolvePath(details.popup, scriptPath),
        );
      }

      let actionToUpdate: any = action;

      if (tabId) {
        if (action.tabs.has(tabId)) {
          actionToUpdate = action.tabs.get(tabId);
        } else {
          actionToUpdate = { tabId };
          action.tabs.set(tabId, actionToUpdate);
        }
      }

      if (actionToUpdate[propName] !== newValue) {
        actionToUpdate[propName] = newValue;
        this.emit('updated', session, getActionForTab(action, details.tabId));
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
        badgeText: '',
      };
      sessionActions.set(extensionId, action);
    }

    return action;
  }

  public async loadFromManifest(
    session: Electron.Session,
    extension: Electron.Extension,
  ): Promise<IBrowserAction> {
    const { browser_action: browserAction } = extension.manifest || {};

    if (!browserAction) return null;

    const {
      default_popup: popup,
      default_title: title,
      default_icon: icon,
    } = browserAction;

    const action = this.getOrCreate(session, extension.id);
    Object.assign(action, {
      popup: resolveUrl(extension.url, resolvePath(popup)),
      icon: await getIconsBase64(icon, extension.path),
      title,
    });

    this.emit('loaded', session, action);

    return action;
  }

  // TODO(sentialx): Tab in callback, fire if the browser action has no popup.
  public onClicked(extensionId: string) {
    this.emit('clicked', extensionId);
  }
}
