import { ipcRenderer, webFrame } from 'electron';
import { format } from 'url';

import { Manifest } from '~/interfaces/manifest';
import IpcEvent from './ipc-event';
import WebRequestEvent from './web-request-event';
import {
  API_STORAGE_OPERATION,
  API_RUNTIME_CONNECT,
  API_PORT_POSTMESSAGE,
  API_I18N_OPERATION,
  API_ALARMS_OPERATION,
} from '~/constants/api-ipc-messages';
import { makeId } from '~/utils';
import { readFileSync } from 'fs';
import { join } from 'path';

class Event {
  private callbacks: Function[] = [];

  public emit(...args: any[]) {
    this.callbacks.forEach(callback => {
      callback(...args);
    });
  }

  public addListener(callback: Function) {
    this.callbacks.push(callback);
  }

  public removeListener(callback: Function) {
    this.callbacks = this.callbacks.filter(x => x !== callback);
  }
}

class Port {
  public sender: chrome.runtime.MessageSender;
  public name: string;
  public onMessage = new Event();
  public onDisconnect = new Event();

  private portId: string;

  constructor(
    portId: string,
    name: string = null,
    sender: chrome.runtime.MessageSender = null,
  ) {
    if (sender) {
      this.sender = sender;
    }

    if (name) {
      this.name = name;
    }

    this.portId = portId;

    ipcRenderer.on(API_PORT_POSTMESSAGE + portId, (e: any, msg: any) => {
      this.onMessage.emit(msg, this);
    });
  }

  public disconnect() {
    ipcRenderer.removeAllListeners(API_PORT_POSTMESSAGE + this.portId);
  }

  public postMessage(msg: any) {
    ipcRenderer.send(API_PORT_POSTMESSAGE, { portId: this.portId, msg });
  }
}

function readProperty(obj: any, prop: string) {
  return obj[prop];
}

const sendStorageOperation = (
  extensionId: string,
  arg: any,
  area: string,
  type: string,
  callback: any,
) => {
  const id = makeId(32);
  ipcRenderer.send(API_STORAGE_OPERATION, {
    extensionId,
    id,
    arg,
    type,
    area,
  });

  if (callback) {
    ipcRenderer.once(API_STORAGE_OPERATION + id, (e: any, ...data: any[]) => {
      callback(data[0]);
    });
  }
};

export const getAPI = (manifest: Manifest) => {
  // https://developer.chrome.com/extensions
  const api = {
    // https://developer.chrome.com/extensions/webNavigation
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

    // https://developer.chrome.com/extensions/extension
    extension: {
      inIncognitoContext: false, // TODO
    },

    // https://developer.chrome.com/extensions/alarms
    alarms: {
      create: (name: string, alarmInfo: any) => {
        ipcRenderer.sendSync(API_ALARMS_OPERATION, {
          extensionId: manifest.extensionId,
          type: 'create',
          name,
          alarmInfo,
        });
      },
      get: (name: string, cb: any) => {},
      getAll: (cb: any) => {
        const id = makeId(32);

        ipcRenderer.send(API_ALARMS_OPERATION, {
          extensionId: manifest.extensionId,
          type: 'get-all',
          id,
        });

        if (cb) {
          ipcRenderer.once(
            API_ALARMS_OPERATION + id,
            (e: any, ...data: any[]) => {
              cb(...data);
            },
          );
        }
      },
      clear: (name: string, cb: any) => {},
      clearAll: (cb: any) => {},
      onAlarm: new IpcEvent('alarms', 'onAlarm'), // TODO
    },

    // https://developer.chrome.com/extensions/runtime
    runtime: {
      id: manifest.extensionId,
      lastError: {},

      onConnect: new Event(),

      connect: (arg1: any = null, arg2: any = null) => {
        const sender: any = {
          id: manifest.extensionId,
        };
        const portId = makeId(32);

        let name: string = null;

        if (typeof arg1 === 'object') {
          if (arg1.includeTlsChannelId) {
            sender.tlsChannelId = portId;
          }
          name = arg1.name;
        }

        ipcRenderer.send(API_RUNTIME_CONNECT, {
          extensionId: manifest.extensionId,
          portId,
          sender,
          name,
        });

        return new Port(portId, name);
      },

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
      onBeforeRequest: new WebRequestEvent('onBeforeRequest'),
      onBeforeSendHeaders: new WebRequestEvent('onBeforeSendHeaders'),
      onHeadersReceived: new WebRequestEvent('onHeadersReceived'),
      onSendHeaders: new WebRequestEvent('onSendHeaders'),
      onResponseStarted: new WebRequestEvent('onResponseStarted'),
      onBeforeRedirect: new WebRequestEvent('onBeforeRedirect'),
      onCompleted: new WebRequestEvent('onCompleted'),
      onErrorOccurred: new WebRequestEvent('onErrorOccurred'),
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
      query: (
        queryInfo: chrome.tabs.QueryInfo,
        callback: (tabs: chrome.tabs.Tab[]) => void,
      ) => {
        ipcRenderer.send('api-tabs-query');

        ipcRenderer.once(
          'api-tabs-query',
          (e: Electron.IpcMessageEvent, data: chrome.tabs.Tab[]) => {
            callback(
              data.filter(tab => {
                for (const key in queryInfo) {
                  const tabProp = readProperty(tab, key);
                  const queryInfoProp = readProperty(queryInfo, key);

                  if (tabProp == null || queryInfoProp !== tabProp) {
                    return false;
                  }
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
      insertCSS: (arg1: any = null, arg2: any = null, arg3: any = null) => {
        const insertCSS = (tabId: number, details: any, callback: any) => {
          if (details.hasOwnProperty('file')) {
            details.code = readFileSync(
              join(manifest.srcDirectory, details.file),
              'utf8',
            );
          }

          ipcRenderer.send('api-tabs-insertCSS', tabId, details);

          ipcRenderer.once('api-tabs-insertCSS', () => {
            if (callback) {
              callback();
            }
          });
        };

        if (typeof arg1 === 'object') {
          api.tabs.getCurrent(tab => {
            insertCSS(tab.id, arg1, arg2);
          });
        } else if (typeof arg1 === 'number') {
          insertCSS(arg1, arg2, arg3);
        }
      },
      executeScript: (arg1: any = null, arg2: any = null, arg3: any = null) => {
        const executeScript = (tabId: number, details: any, callback: any) => {
          if (details.hasOwnProperty('file')) {
            details.code = readFileSync(
              join(manifest.srcDirectory, details.file),
              'utf8',
            );
          }

          ipcRenderer.send('api-tabs-executeScript', tabId, details);

          ipcRenderer.once(
            'api-tabs-executeScript',
            (e: Electron.IpcMessageEvent, result: any) => {
              if (callback) {
                callback(result);
              }
            },
          );
        };
        if (typeof arg1 === 'object') {
          api.tabs.getCurrent(tab => {
            executeScript(tab.id, arg1, arg2);
          });
        } else if (typeof arg1 === 'number') {
          executeScript(arg1, arg2, arg3);
        }
      },
      setZoom: (tabId: number, zoomFactor: number, callback: () => void) => {
        ipcRenderer.send('api-tabs-setZoom', tabId, zoomFactor);

        ipcRenderer.once('api-tabs-setZoom', () => {
          if (callback) {
            callback();
          }
        });
      },
      getZoom: (tabId: number, callback: (zoomFactor: number) => void) => {
        ipcRenderer.send('api-tabs-getZoom', tabId);

        ipcRenderer.once(
          'api-tabs-getZoom',
          (e: Electron.IpcMessageEvent, zoomFactor: number) => {
            if (callback) {
              callback(zoomFactor);
            }
          },
        );
      },
      detectLanguage: (tabId: number, callback: (language: string) => void) => {
        ipcRenderer.send('api-tabs-detectLanguage', tabId);

        ipcRenderer.once(
          'api-tabs-detectLanguage',
          (e: Electron.IpcMessageEvent, language: string) => {
            if (callback) {
              callback(language);
            }
          },
        );
      },

      onCreated: new IpcEvent('tabs', 'onCreated'),
      onUpdated: new IpcEvent('tabs', 'onUpdated'),
      onActivated: new IpcEvent('tabs', 'onActivated'),
      onRemoved: new IpcEvent('tabs', 'onRemoved'),
    },

    // https://developer.chrome.com/extensions/storage
    storage: {
      local: {
        set: (arg: any, cb: any) => {
          sendStorageOperation(manifest.extensionId, arg, 'local', 'set', cb);
        },
        get: (arg: any, cb: any) => {
          sendStorageOperation(manifest.extensionId, arg, 'local', 'get', cb);
        },
        remove: (arg: any, cb: any) => {
          sendStorageOperation(
            manifest.extensionId,
            arg,
            'local',
            'remove',
            cb,
          );
        },
        clear: (arg: any, cb: any) => {
          sendStorageOperation(manifest.extensionId, arg, 'local', 'clear', cb);
        },
      },
      sync: {
        set: (arg: any, cb: any) => {
          sendStorageOperation(manifest.extensionId, arg, 'sync', 'set', cb);
        },
        get: (arg: any, cb: any) => {
          sendStorageOperation(manifest.extensionId, arg, 'sync', 'get', cb);
        },
        remove: (arg: any, cb: any) => {
          sendStorageOperation(manifest.extensionId, arg, 'sync', 'remove', cb);
        },
        clear: (arg: any, cb: any) => {
          sendStorageOperation(manifest.extensionId, arg, 'sync', 'clear', cb);
        },
      },
      managed: {
        get: (arg: any, cb: any) => {
          sendStorageOperation(manifest.extensionId, arg, 'managed', 'get', cb);
        },
      },
      onChanged: {
        addListener: () => {
          console.log('onchanged');
        },
      },
    },

    // https://developer.chrome.com/extensions/i18n
    i18n: {
      getAcceptLanguages: (cb: any) => {
        const id = makeId(32);

        ipcRenderer.send(API_I18N_OPERATION, {
          extensionId: manifest.extensionId,
          type: 'get-accept-languages',
          id,
        });

        if (cb) {
          ipcRenderer.once(
            API_I18N_OPERATION + id,
            (e: any, ...data: any[]) => {
              cb(...data);
            },
          );
        }
      },
      getMessage: (messageName: string, substitutions: any) => {
        if (messageName === '@@ui_locale') {
          return 'en';
        }

        return ipcRenderer.sendSync(API_I18N_OPERATION, {
          extensionId: manifest.extensionId,
          type: 'get-message',
          substitutions,
          messageName,
        });
      },
      getUILanguage: () => {
        return ipcRenderer.sendSync(API_I18N_OPERATION, {
          extensionId: manifest.extensionId,
          type: 'get-ui-language',
        });
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

    browserAction: {
      onClicked: {
        addListener: () => {},
      },
      setIcon: () => {},
      setBadgeBackgroundColor: () => {},
      setBadgeText: (details: any, cb: any) => {
        console.log(details);
      },
    },
  };

  ipcRenderer.on(
    API_RUNTIME_CONNECT,
    (e: Electron.IpcMessageEvent, data: any) => {
      const { portId, sender, name } = data;
      const port = new Port(portId, name, sender);
      api.runtime.onConnect.emit(port);
    },
  );

  return api;
};
