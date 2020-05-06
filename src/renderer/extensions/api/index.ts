import { ipcInvoker } from '../ipc-invoker';
import { imageData2base64 } from '../image-data';
import { IpcEvent } from '../ipc-event';
import {
  TAB_ID_NONE,
  WINDOW_ID_NONE,
  WINDOW_ID_CURRENT,
} from '~/common/extensions/constants';
import { WebRequestEvent } from '../web-request-event';

declare const chrome: any;

class PolicyConfig {
  get() {}
  set() {}
  clear() {}
}

export const getAPI = () => {
  const manifest = chrome?.runtime ? chrome.runtime.getManifest() : {};

  const tabs = {
    ...chrome.tabs,
    TAB_ID_NONE,
    getCurrent: ipcInvoker('tabs.getCurrent'),
    create: ipcInvoker('tabs.create'),
    get: ipcInvoker('tabs.get'),
    remove: ipcInvoker('tabs.remove'),
    getAllInWindow: ipcInvoker('tabs.getAllInWindow'),
    getSelected: ipcInvoker('tabs.getSelected'),
    insertCSS: ipcInvoker('tabs.insertCSS'),
    query: ipcInvoker('tabs.query'),
    reload: ipcInvoker('tabs.reload'),
    update: ipcInvoker('tabs.update'),
    onCreated: new IpcEvent('tabs.onCreated'),
    onRemoved: new IpcEvent('tabs.onRemoved'),
    onUpdated: new IpcEvent('tabs.onUpdated'),
    onActivated: new IpcEvent('tabs.onActivated'),
  };

  const cookies = {
    ...chrome.cookies,
    get: ipcInvoker('cookies.get'),
    getAll: ipcInvoker('cookies.getAll'),
    remove: ipcInvoker('cookies.remove'),
    set: ipcInvoker('cookies.set'),
    onChanged: new IpcEvent('cookies.onChanged'),
  };

  const windows = {
    ...chrome.windows,
    WINDOW_ID_NONE,
    WINDOW_ID_CURRENT,
    get: ipcInvoker('windows.get'),
    getAll: ipcInvoker('windows.getAll'),
    getCurrent: ipcInvoker('windows.getCurrent'),
    getLastFocused: ipcInvoker('windows.getLastFocused'),
    create: ipcInvoker('windows.create'),
    update: ipcInvoker('windows.update'),
    remove: ipcInvoker('windows.remove'),
    onCreated: new IpcEvent('windows.onCreated'),
    onRemoved: new IpcEvent('windows.onRemoved'),
    onFocusChanged: new IpcEvent('windows.onFocusChanged'),
  };

  const extension = {
    ...chrome.extension,
    getViews: (): any[] => [],
    isAllowedFileSchemeAccess: (cb: any) => cb && cb(false),
    isAllowedIncognitoAccess: (cb: any) => cb && cb(false),
  };

  const contextMenus = {
    ...chrome.contextMenus,
    onClicked: new IpcEvent('contextMenus.onClicked'),
    create: ipcInvoker('contextMenus.create', { noop: true }),
    removeAll: ipcInvoker('contextMenus.removeAll', { noop: true }),
    remove: ipcInvoker('contextMenus.remove', { noop: true }),
  };

  const notifications = {
    ...chrome.notifications,
    create() {},
    update() {},
    clear() {},
    getAll() {},
    getPermissionLevel() {},
    onClosed: new IpcEvent('notifications.onClosed'),
    onClicked: new IpcEvent('notifications.onClicked'),
    onButtonClicked: new IpcEvent('notifications.onButtonClicked'),
    onPermissionLevelChanged: new IpcEvent(
      'notifications.onPermissionLevelChanged',
    ),
    onShowSettings: new IpcEvent('notifications.onShowSettings'),
  };

  const permissions = {
    ...chrome.permissions,
    onAdded: new IpcEvent('permissions.onAdded'),
    getAll: () => {},
  };

  const privacy = {
    ...chrome.privacy,
    network: {
      networkPredictionEnabled: new PolicyConfig(),
      webRTCIPHandlingPolicy: new PolicyConfig(),
      webRTCMultipleRoutesEnabled: new PolicyConfig(),
      webRTCNonProxiedUdpEnabled: new PolicyConfig(),
    },
    websites: {
      hyperlinkAuditingEnabled: new PolicyConfig(),
    },
  };

  const browserAction = {
    ...chrome.browserAction,
    setBadgeBackgroundColor: ipcInvoker(
      'browserAction.setBadgeBackgroundColor',
      {
        includeId: true,
      },
    ),
    setBadgeText: ipcInvoker('browserAction.setBadgeText', {
      includeId: true,
    }),
    setIcon: ipcInvoker('browserAction.setIcon', {
      includeId: true,
      serialize: (details: any) => {
        if (details.imageData) {
          if (details.imageData instanceof ImageData) {
            details.imageData = imageData2base64(details.imageData);
          } else {
            details.imageData = Object.entries(details.imageData).reduce(
              (obj: any, pair: any) => {
                obj[pair[0]] = imageData2base64(pair[1]);
                return obj;
              },
              {},
            );
          }
        }

        return [details];
      },
    }),
    setTitle: ipcInvoker('browserAction.setTitle', {
      includeId: true,
    }),
    setPopup: ipcInvoker('browserAction.setPopup', {
      includeId: true,
    }),
    onClicked: new IpcEvent('browserAction.onClicked'),
  };

  const webRequest = {
    ...chrome.webRequest,
    ResourceType: {
      CSP_REPORT: 'csp_report',
      FONT: 'font',
      IMAGE: 'image',
      MAIN_FRAME: 'main_frame',
      MEDIA: 'media',
      OBJECT: 'object',
      OTHER: 'other',
      PING: 'ping',
      SCRIPT: 'script',
      STYLESHEET: 'stylesheet',
      SUB_FRAME: 'sub_frame',
      WEBSOCKET: 'websocket',
      XMLHTTPREQUEST: 'xmlhttprequest',
    },

    onBeforeRequest: new WebRequestEvent('onBeforeRequest'),
    onBeforeSendHeaders: new WebRequestEvent('onBeforeSendHeaders'),
    onHeadersReceived: new WebRequestEvent('onHeadersReceived'),
    onSendHeaders: new WebRequestEvent('onSendHeaders'),
    onResponseStarted: new WebRequestEvent('onResponseStarted'),
    onBeforeRedirect: new WebRequestEvent('onBeforeRedirect'),
    onCompleted: new WebRequestEvent('onCompleted'),
    onErrorOccurred: new WebRequestEvent('onErrorOccurred'),
    onAuthRequired: new WebRequestEvent('onAuthRequired'),
  };

  const webNavigation = {
    ...chrome.webNavigation,
    onBeforeNavigate: new IpcEvent('webNavigation.onBeforeNavigate'),
    onCompleted: new IpcEvent('webNavigation.onCompleted'),
    onCreatedNavigationTarget: new IpcEvent(
      'webNavigation.onCreatedNavigationTarget',
    ),
    onCommitted: new IpcEvent('webNavigation.onCommitted'),
  };

  const api: any = {
    tabs,
    cookies,
    windows,
    extension,
    notifications,
    permissions,
    contextMenus,
    webNavigation,
    webRequest,
    privacy,
  };

  if (manifest.browser_action) {
    api.browserAction = browserAction;
  }

  if (chrome.storage) {
    api.storage = {
      ...chrome.storage,
      sync: chrome.storage.local,
    };
  }

  return api;
};
