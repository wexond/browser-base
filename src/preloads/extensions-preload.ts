import { ipcRenderer } from 'electron';
import { IpcEvent } from './models/ipc-event';
import { replaceAll } from '~/utils/string';

const callCookiesMethod = async (
  method: 'getAll' | 'remove' | 'set',
  details: any,
) => {
  return await ipcRenderer.invoke(`api-cookies-${method}`, details);
};

window.chrome = {
  contextMenus: {
    onClicked: new IpcEvent('contextMenus', 'onClicked'),
    create: () => {},
    removeAll: () => {},
  },

  windows: {
    get: () => {},
    onFocusChanged: new IpcEvent('windows', 'onFocusChanged'),
  },

  privacy: {
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
  },

  browserAction: {
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
  },

  cookies: {
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
  },

  webNavigation: {
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
  },

  i18n: {
    getAcceptLanguages: (cb: any) => {
      if (cb) {
        cb(navigator.languages);
      }
    },
    getMessage: (messageName: string, substitutions?: any) => {
      if (messageName === '@@ui_locale') return 'en_US';
      else if (messageName === '@@extension_id') return chrome.runtime.id;

      const locale = ipcRenderer.sendSync('api-get-locale', chrome.runtime.id);
      const substitutionsArray = substitutions instanceof Array;

      const item = locale[messageName];

      if (item == null) return '';
      if (substitutionsArray && substitutions.length >= 9) return null;

      let message = item.message;

      if (typeof item.placeholders === 'object') {
        for (const placeholder in item.placeholders) {
          message = replaceAll(
            message,
            `$${placeholder}$`,
            item.placeholders[placeholder].content,
          );
        }
      }

      if (substitutionsArray) {
        for (let i = 0; i < 9; i++) {
          message = replaceAll(message, `$${i + 1}`, substitutions[i] || ' ');
        }
      }

      return message;
    },

    getUILanguage: () => {
      return navigator.language;
    },

    detectLanguage: (text: string, cb: any) => {
      // TODO
      if (cb) {
        cb({
          isReliable: false,
          languages: [],
        });
      }
    },
  },

  tabs: {},
  storage: {},
} as any;

process.on('document-start', () => {
  const tabs = {
    onCreated: new IpcEvent('tabs', 'onCreated'),
    onUpdated: new IpcEvent('tabs', 'onUpdated'),
    onActivated: new IpcEvent('tabs', 'onActivated'),
    onRemoved: new IpcEvent('tabs', 'onRemoved'),

    get: (tabId: number, callback: (tab: chrome.tabs.Tab) => void) => {
      chrome.tabs.query({}, tabs => {
        callback(tabs.find(x => x.id === tabId));
      });
    },

    getCurrent: (callback: (tab: chrome.tabs.Tab) => void) => {
      chrome.tabs.get(ipcRenderer.sendSync('get-webcontents-id'), tab => {
        callback(tab);
      });
    },

    query: async (queryInfo: any, callback: (tabs: any[]) => void) => {
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

    setZoom: (tabId: number, zoomFactor: number, callback: () => void) => {
      ipcRenderer.send(`api-tabs-setZoom`, tabId, zoomFactor);

      ipcRenderer.once('api-tabs-setZoom', () => {
        if (callback) {
          callback();
        }
      });
    },

    getZoom: (tabId: number, callback: (zoomFactor: number) => void) => {
      ipcRenderer.send(`api-tabs-getZoom`, tabId);

      ipcRenderer.once('api-tabs-getZoom', (e, zoomFactor: number) => {
        if (callback) {
          callback(zoomFactor);
        }
      });
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
        chrome.tabs.getCurrent(tab => {
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

  chrome.tabs = Object.assign(chrome.tabs, tabs);
  chrome.storage.sync = chrome.storage.local;

  console.log(chrome);
});
