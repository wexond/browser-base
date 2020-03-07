import { ipcRenderer } from 'electron';
import { IpcEvent } from './models/ipc-event';

declare const chrome: any;

const callCookiesMethod = async (
  method: 'getAll' | 'remove' | 'set',
  details: any,
) => {
  return await ipcRenderer.invoke(`api-cookies-${method}`, details);
};

(process as any).on('document-start', () => {
  if (Object.keys(chrome).length === 0) return;

  const tabs = {
    onCreated: new IpcEvent('tabs', 'onCreated'),
    onUpdated: new IpcEvent('tabs', 'onUpdated'),
    onActivated: new IpcEvent('tabs', 'onActivated'),
    onRemoved: new IpcEvent('tabs', 'onRemoved'),

    get: (tabId: number, callback: (tab: chrome.tabs.Tab) => void) => {
      tabs.query({}, tabs => {
        callback(tabs.find(x => x.id === tabId));
      });
    },

    getCurrent: (callback: (tab: chrome.tabs.Tab) => void) => {
      tabs.get(ipcRenderer.sendSync('get-webcontents-id'), tab => {
        callback(tab);
      });
    },

    query: async (
      queryInfo: any,
      callback: (tabs: chrome.tabs.Tab[]) => void,
    ) => {
      const readProperty = (obj: any, prop: string) => obj[prop];
      const data: chrome.tabs.Tab[] = await ipcRenderer.invoke(
        `api-tabs-query`,
      );

      callback(
        data.filter(tab => {
          for (const key in queryInfo) {
            const tabProp = readProperty(tab, key);
            const queryInfoProp = readProperty(queryInfo, key);

            if (key === 'url' && queryInfoProp === '<all_urls>') {
              return true;
            }

            if (tabProp == null || queryInfoProp !== tabProp) {
              return false;
            }
          }

          return true;
        }),
      );
    },

    detectLanguage: (tabId: number, callback: (language: string) => void) => {
      ipcRenderer.send(`api-tabs-detectLanguage`, tabId);

      ipcRenderer.once('api-tabs-detectLanguage', (e, language: string) => {
        if (callback) {
          callback(language);
        }
      });
    },

    insertCSS: (...args: any[]) => {
      const insertCSS = async (tabId: number, details: any, callback: any) => {
        await ipcRenderer.invoke(
          `api-tabs-insertCSS`,
          tabId,
          details,
          chrome.runtime.id,
        );
        if (callback) callback();
      };

      if (typeof args[0] === 'object') {
        tabs.getCurrent(tab => {
          insertCSS(tab.id, args[0], args[1]);
        });
      } else if (typeof args[0] === 'number') {
        insertCSS(args[0], args[1], args[2]);
      }
    },

    create: async (
      createProperties: any,
      callback: (tab: any) => void = null,
    ) => {
      const data = await ipcRenderer.invoke(
        `api-tabs-create`,
        createProperties,
      );

      if (callback) {
        callback(data);
      }
    },

    update: () => {},
  };

  chrome.contextMenus = {
    onClicked: new IpcEvent('contextMenus', 'onClicked'),
    create: () => {},
    removeAll: () => {},
    remove: () => {},
  };

  chrome.windows = {
    get: () => {},
    onFocusChanged: new IpcEvent('windows', 'onFocusChanged'),
  };

  chrome.privacy = {
    network: {
      networkPredictionEnabled: {
        set: () => {},
        clear: () => {},
      },
      webRTCMultipleRoutesEnabled: {},
      webRTCNonProxiedUdpEnabled: {},
      webRTCIPHandlingPolicy: {},
    },
    websites: {
      hyperlinkAuditingEnabled: {
        set: () => {},
        clear: () => {},
      },
    },
  };

  chrome.browserAction = {
    onClicked: new IpcEvent('browserAction', 'onClicked'),

    setIcon: (details: any, cb: any) => {
      if (cb) cb();
    },

    setBadgeBackgroundColor: (details: any, cb: any) => {
      if (cb) cb();
    },

    setBadgeText: async (details: any, cb: any) => {
      await ipcRenderer.invoke(
        `api-browserAction-setBadgeText`,
        chrome.runtime.id,
        details,
      );

      if (cb) {
        cb();
      }
    },
  };

  chrome.cookies = {
    onChanged: new IpcEvent('cookies', 'onChanged'),

    get: async (details: any, callback: any) => {
      if (callback) callback((await callCookiesMethod('getAll', details))[0]);
    },

    getAll: async (details: any, callback: any) => {
      if (callback) callback(await callCookiesMethod('getAll', details));
    },

    set: async (details: any, callback: any) => {
      if (callback) callback(await callCookiesMethod('set', details));
    },

    remove: async (details: any, callback: any) => {
      if (callback) callback(await callCookiesMethod('remove', details));
    },
  };

  chrome.webNavigation = {
    onBeforeNavigate: new IpcEvent('webNavigation', 'onBeforeNavigate'),
    onCommitted: new IpcEvent('webNavigation', 'onCommitted'),
    onDOMContentLoaded: new IpcEvent('webNavigation', 'onDOMContentLoaded'),
    onCompleted: new IpcEvent('webNavigation', 'onCompleted'),
    onCreatedNavigationTarget: new IpcEvent(
      'webNavigation',
      'onCreatedNavigationTarget',
    ),
    onReferenceFragmentUpdated: new IpcEvent(
      'webNavigation',
      'onReferenceFragmentUpdated',
    ), // TODO
    onTabReplaced: new IpcEvent('webNavigation', 'onTabReplaced'), // TODO
    onHistoryStateUpdated: new IpcEvent(
      'webNavigation',
      'onHistoryStateUpdated',
    ), // TODO
  };

  chrome.extension.isAllowedFileSchemeAccess = (cb: any) => {
    if (cb) cb(false);
  };

  chrome.extension.isAllowedIncognitoAccess = (cb: any) => {
    if (cb) cb(false);
  };

  chrome.tabs = Object.assign(chrome.tabs, tabs);
  (chrome.storage as any).sync = chrome.storage.local;
});
