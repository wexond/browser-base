import { ipcRenderer } from 'electron';
import { imageData2base64 } from '../image-data';

const getGeneratedAPI = require('./_generated_api.js');

declare const chrome: any;

class PolicyConfig {
  get() {}
  set() {}
  clear() {}
}

export class StubEvent {
  addListener() {}
  removeListener() {}
}

export const getAPI = (context: string): any => {
  const manifest = chrome?.runtime ? chrome.runtime.getManifest() : {};

  const generated = getGeneratedAPI(
    context,
    async (scope: string, name: string, params: any) => {
      if (params.details && params.details.imageData) {
        if (params.details.imageData instanceof ImageData) {
          params.details.imageData = imageData2base64(params.details.imageData);
        } else {
          params.details.imageData = Object.entries(
            params.details.imageData,
          ).reduce((obj: any, pair: any) => {
            obj[pair[0]] = imageData2base64(pair[1]);
            return obj;
          }, {});
        }
      }

      return await ipcRenderer.invoke(`${scope}.${name}`, {
        params: { ...params, callback: undefined },
        info: {
          scriptPath: window.location.pathname,
          extensionId: chrome?.runtime?.id,
        },
      });
    },
  );

  const tabs = {
    ...chrome.tabs,
    ...generated.tabs,
  };

  const cookies = {
    ...chrome.cookies,
    ...generated.cookies,
  };

  const windows = {
    ...chrome.windows,
    ...generated.windows,
  };

  const extension = {
    ...chrome.extension,
    ...generated.extension,
    getViews: (): any[] => [],
    isAllowedFileSchemeAccess: (cb: any) => cb && cb(false),
    isAllowedIncognitoAccess: (cb: any) => cb && cb(false),
  };

  const notifications = {
    ...chrome.notifications,
    ...generated.notifications,
    create() {},
    update() {},
    clear() {},
    getAll() {},
    getPermissionLevel() {},
    onClosed: new StubEvent(),
    onClicked: new StubEvent(),
    onButtonClicked: new StubEvent(),
    onPermissionLevelChanged: new StubEvent(),
    onShowSettings: new StubEvent(),
  };

  const webRequest = {
    ...chrome.webRequest,
    ...generated.webRequest,
  };

  const webNavigation = {
    ...chrome.webNavigation,
    ...generated.webNavigation,
  };

  const permissions = {
    ...chrome.permissions,
    ...generated.permissions,
    getAll: (cb: any) => cb && cb([]),
    onAdded: new StubEvent(),
    contains: (perm: any, cb: any) => cb && cb(true),
    request: (perm: any, cb: any) => cb && cb(true),
  };

  const contextMenus = {
    ...chrome.contextMenus,
    ...generated.contextMenus,
    create: () => {},
    removeAll: () => {},
    remove: () => {},
    onClicked: new StubEvent(),
  };

  const privacy = {
    ...chrome.privacy,
    ...generated.privacy,
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
    ...generated.browserAction,
  };

  const api = {
    ...chrome,
    ...generated,
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
    browserAction,
    storage: {},
  };

  if (chrome.storage) {
    chrome.storage.sync = chrome.storage.local;
    chrome.storage.managed = {
      get: (a, cb) => cb && cb({}),
    };
  }

  return api;
};
