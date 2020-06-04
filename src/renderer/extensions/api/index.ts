import { ipcRenderer } from 'electron';
import { imageData2base64 } from '../image-data';

const assign = require('assign-deep');
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

  const api = assign({ ...chrome }, generated);

  if (context === 'blessed_extension') {
    if (api.storage) {
      api.storage.sync = api.storage.local;
      api.storage.managed = {
        get: (a: any, cb: any) => cb && cb({}),
      };
    }

    api.extension = {
      getViews: (): any[] => [],
      isAllowedFileSchemeAccess: (cb: any) => cb && cb(false),
      isAllowedIncognitoAccess: (cb: any) => cb && cb(false),
    };

    api.notifications = {
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

    api.permissions = {
      getAll: (cb: any) => cb && cb([]),
      onAdded: new StubEvent(),
      contains: (perm: any, cb: any) => cb && cb(true),
      request: (perm: any, cb: any) => cb && cb(true),
    };

    api.contextMenus = {
      create: () => {},
      removeAll: () => {},
      remove: () => {},
      onClicked: new StubEvent(),
    };

    api.privacy = {
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
  }

  return api;
};
