import { ipcRenderer } from 'electron';
import { IpcEvent } from './models/ipc-event';
import { BrowserActionChangeType, BROWSER_ACTION_METHODS } from '~/interfaces';

declare const chrome: any;

const callCookiesMethod = async (
  method: 'getAll' | 'remove' | 'set',
  details: any,
) => {
  return await ipcRenderer.invoke(`api-cookies-${method}`, details);
};

const queryTabs = async (queryInfo: any): Promise<chrome.tabs.Tab[]> => {
  const readProperty = (obj: any, prop: string) => obj[prop];
  const data: chrome.tabs.Tab[] = await ipcRenderer.invoke(`api-tabs-query`);

  return data.filter((tab) => {
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
  });
};

const getTab = async (tabId: number) => {
  return (await queryTabs({ id: tabId }))[0];
};

const changeBrowserActionInfo = async (
  extensionId: string,
  action: BrowserActionChangeType,
  details: any,
) => {
  return await ipcRenderer.invoke(
    `api-browserAction-change-info`,
    extensionId,
    action,
    details,
  );
};

(process as any).on('document-start', () => {
  if (Object.keys(chrome).length === 0) return;

  const tabs = {
    onCreated: new IpcEvent('tabs', 'onCreated'),
    onUpdated: new IpcEvent('tabs', 'onUpdated'),
    onActivated: new IpcEvent('tabs', 'onActivated'),
    onRemoved: new IpcEvent('tabs', 'onRemoved'),

    get: async (tabId: number, callback: (tab: chrome.tabs.Tab) => void) => {
      if (callback) {
        callback(await getTab(tabId));
      }
    },

    getCurrent: async (callback: (tab: chrome.tabs.Tab) => void) => {
      if (callback) {
        callback(await getTab(ipcRenderer.sendSync('get-webcontents-id')));
      }
    },

    getSelected: async (...args: any[]) => {
      let query: any = { active: true };
      let cb = args[1];
      if (typeof args[0] === 'number') {
        query = { ...query, windowId: args[0] };
      } else {
        cb = args[0];
      }

      const tabs = await queryTabs(query);

      if (cb) cb(tabs[0]);
    },

    query: async (
      queryInfo: any,
      callback: (tabs: chrome.tabs.Tab[]) => void,
    ) => {
      const tabs = await queryTabs(queryInfo);

      if (callback) {
        callback(tabs);
      }
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
        tabs.getCurrent((tab) => {
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
    getAll: () => {},
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
  };

  BROWSER_ACTION_METHODS.forEach((method) => {
    chrome.browserAction[method] = async (details: any, cb: any) => {
      if (details.imageData) {
        return;
        // TODO(sentialx): convert to buffer
        details.imageData.data = Buffer.from(details.imageData.data);
      }
      await changeBrowserActionInfo(chrome.runtime.id, method, details);
      if (cb) cb();
    };
  });

  chrome.notifications = {
    onClicked: new IpcEvent('notifications', 'onClicked'),
  };

  chrome.permissions = {
    onAdded: new IpcEvent('permissions', 'onAdded'),
    getAll: () => {},
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

  if (chrome.storage) {
    chrome.storage.sync = chrome.storage.local;
  }
});
