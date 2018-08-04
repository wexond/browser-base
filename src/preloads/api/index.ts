import { ipcRenderer } from 'electron';
import { format } from 'url';

export interface Manifest extends chrome.runtime.Manifest {
  extensionId: string;
  srcDirectory: string;
}

/* eslint no-bitwise: 0 */
const hashCode = (string: string) => {
  let hash = 0;

  if (string.length === 0) {
    return hash;
  }

  for (let i = 0; i < string.length; i++) {
    const chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

class WebRequestEvent {
  private scope: string;

  private name: string;

  private callbacks: Function[] = [];

  private listener: boolean = false;

  constructor(scope: string, name: string) {
    this.scope = scope;
    this.name = name;

    this.emit = this.emit.bind(this);
  }

  emit(e: Electron.IpcMessageEvent, details: any) {
    this.callbacks.forEach(callback => {
      console.log(this.name, details);
      ipcRenderer.send(`api-response-${this.scope}-${this.name}`, callback(details));
    });
  }

  addListener(callback: Function) {
    this.callbacks.push(callback);

    if (!this.listener) {
      ipcRenderer.on(`api-emit-event-${this.scope}-${this.name}`, this.emit);
      ipcRenderer.send(`api-add-listener-${this.scope}-${this.name}`);
      this.listener = true;
    }
  }

  removeListener(callback: Function) {
    this.callbacks = this.callbacks.filter(c => c !== callback);

    if (this.callbacks.length === 0) {
      ipcRenderer.removeListener(`api-emit-event-${this.scope}-${this.name}`, this.emit);
      ipcRenderer.send(`api-remove-listener-${this.scope}-${this.name}`);
      this.listener = false;
    }
  }
}

class IpcEvent {
  private scope: string;

  private name: string;

  private callbacks: Function[] = [];

  private listener: boolean = false;

  constructor(scope: string, name: string) {
    this.name = name;
    this.scope = scope;

    this.emit = this.emit.bind(this);
  }

  emit(e: Electron.IpcMessageEvent, ...args: any[]) {
    this.callbacks.forEach(callback => {
      callback(...args);
    });
  }

  addListener(callback: Function) {
    this.callbacks.push(callback);

    if (!this.listener) {
      ipcRenderer.on(`api-emit-event-${this.scope}-${this.name}`, this.emit);
      this.listener = true;
    }
  }

  removeListener(callback: Function) {
    this.callbacks = this.callbacks.filter(x => x !== callback);

    if (this.callbacks.length === 0) {
      ipcRenderer.removeListener(`api-emit-event-${this.scope}-${this.name}`, this.emit);
      this.listener = false;
    }
  }
}

function readProperty(obj: any, prop: string) {
  return obj[prop];
}

export const getAPI = (manifest: Manifest) => {
  // https://developer.chrome.com/extensions
  const api = {
    // https://developer.chrome.com/extensions/webNavigation
    webNavigation: {
      onBeforeNavigate: new IpcEvent('webNavigation', 'onBeforeNavigate'),
      onCommitted: new IpcEvent('webNavigation', 'onCommitted'),
      onDOMContentLoaded: new IpcEvent('webNavigation', 'onDOMContentLoaded'),
      onCompleted: new IpcEvent('webNavigation', 'onCompleted'),
      onCreatedNavigationTarget: new IpcEvent('webNavigation', 'onCreatedNavigationTarget'),
      onReferenceFragmentUpdated: new IpcEvent('webNavigation', 'onReferenceFragmentUpdated'), // TODO
      onTabReplaced: new IpcEvent('webNavigation', 'onTabReplaced'), // TODO
      onHistoryStateUpdated: new IpcEvent('webNavigation', 'onHistoryStateUpdated'), // TODO
    },

    // https://developer.chrome.com/extensions/extension
    extension: {
      inIncognitoContext: false, // TODO
    },

    // https://developer.chrome.com/extensions/alarms
    alarms: {
      onAlarm: new IpcEvent('alarms', 'onAlarm'), // TODO
    },

    // https://developer.chrome.com/extensions/runtime
    runtime: {
      id: manifest.extensionId,
      lastError: undefined as string,

      onConnect: new IpcEvent('runtime', 'onConnect'),

      reload: () => {
        ipcRenderer.send('api-runtime-reload', manifest.extensionId);
      },
      getManifest: () => manifest,
      getURL: (path: string) =>
        format({
          protocol: 'wexond-extension',
          slashes: true,
          hostname: api.runtime.id,
          pathname: path,
        }),
    },

    // https://developer.chrome.com/extensions/webRequest
    webRequest: {
      onBeforeRequest: new WebRequestEvent('webRequest', 'onBeforeRequest'),
      onBeforeSendHeaders: new WebRequestEvent('webRequest', 'onBeforeSendHeaders'),
      onHeadersReceived: new WebRequestEvent('webRequest', 'onHeadersReceived'),
      onSendHeaders: new WebRequestEvent('webRequest', 'onSendHeaders'),
      onResponseStarted: new WebRequestEvent('webRequest', 'onResponseStarted'),
      onBeforeRedirect: new WebRequestEvent('webRequest', 'onBeforeRedirect'),
      onCompleted: new WebRequestEvent('webRequest', 'onCompleted'),
      onErrorOccurred: new WebRequestEvent('webRequest', 'onErrorOccurred'),
    },

    // https://developer.chrome.com/extensions/tabs
    tabs: {
      get: (tabId: number, callback: (tab: chrome.tabs.Tab) => void) => {
        api.tabs.query({}, tabs => {
          callback(tabs.find(x => x.id === tabId));
        });
      },
      getCurrent: (callback: (tab: chrome.tabs.Tab) => void) => {
        ipcRenderer.sendToHost('api-tabs-getCurrent');

        ipcRenderer.once(
          'api-tabs-getCurrent',
          (e: Electron.IpcMessageEvent, data: chrome.tabs.Tab) => {
            callback(data);
          },
        );
      },
      query: (queryInfo: chrome.tabs.QueryInfo, callback: (tabs: chrome.tabs.Tab[]) => void) => {
        ipcRenderer.send('api-tabs-query');

        ipcRenderer.once(
          'api-tabs-query',
          (e: Electron.IpcMessageEvent, data: chrome.tabs.Tab[]) => {
            callback(
              data.filter(tab => {
                for (const key in queryInfo) {
                  const tabProp = readProperty(tab, key);
                  const queryInfoProp = readProperty(queryInfo, key);

                  if (tabProp == null || queryInfoProp !== tabProp) return false;
                }

                return true;
              }),
            );
          },
        );
      },
      create: (
        createProperties: chrome.tabs.CreateProperties,
        callback: (tab: chrome.tabs.Tab) => void = null,
      ) => {
        ipcRenderer.send('api-tabs-create', createProperties);

        if (callback) {
          ipcRenderer.once(
            'api-tabs-create',
            (e: Electron.IpcMessageEvent, data: chrome.tabs.Tab) => {
              callback(data);
            },
          );
        }
      },
      insertCSS: (tabId: number, details: chrome.tabs.InjectDetails, callback: () => void) => {
        ipcRenderer.send('api-tabs-insertCSS', tabId, details);

        ipcRenderer.on('api-tabs-insertCSS', () => {
          if (callback) callback();
        });
      },
      executeScript: (
        tabId: number,
        details: chrome.tabs.InjectDetails,
        callback: (result: any) => void,
      ) => {
        ipcRenderer.send('api-tabs-executeScript', tabId, details);

        ipcRenderer.on('api-tabs-executeScript', (e: Electron.IpcMessageEvent, result: any) => {
          if (callback) callback(result);
        });
      },

      onCreated: new IpcEvent('tabs', 'onCreated'),
      onUpdated: new IpcEvent('tabs', 'onUpdated'),
      onMoved: new IpcEvent('tabs', 'onMoved'), // TODO
      onActivated: new IpcEvent('tabs', 'onActivated'), // TODO
      onHighlighted: new IpcEvent('tabs', 'onHighlighted'), // TODO
      onDetached: new IpcEvent('tabs', 'onDetached'), // TODO
      onAttached: new IpcEvent('tabs', 'onAttached'), // TODO
      onRemoved: new IpcEvent('tabs', 'onRemoved'), // TODO
      onReplaced: new IpcEvent('tabs', 'onReplaced'), // TODO
      onZoomChange: new IpcEvent('tabs', 'onZoomChange'), // TODO
    },
    storage: {
      local: {
        get: () => {},
      },
      sync: {},
      onChanged: {},
    },
    i18n: {
      getMessage: () => {},
    },
    windows: {},
    browserAction: {
      onClicked: {
        addListener: () => {},
      },
    },
  };
  return api;
};
