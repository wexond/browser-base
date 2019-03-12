import { ipcRenderer } from 'electron';
import { readFileSync } from 'fs';
import { join } from 'path';
import { API } from '.';
import { IpcEvent } from '..';

let api: API;
let currentTabId: number;

// https://developer.chrome.com/extensions/tabs

export class Tabs {
  public onCreated = new IpcEvent('tabs', 'onCreated');
  public onUpdated = new IpcEvent('tabs', 'onUpdated');
  public onActivated = new IpcEvent('tabs', 'onActivated');
  public onRemoved = new IpcEvent('tabs', 'onRemoved');

  // tslint:disable-next-line
  constructor(_api: API, tabId: number) {
    api = _api;
    currentTabId = tabId;
  }

  public get = (tabId: number, callback: (tab: chrome.tabs.Tab) => void) => {
    this.query({}, tabs => {
      callback(tabs.find(x => x.id === tabId));
    });
  };

  public getCurrent = (callback: (tab: chrome.tabs.Tab) => void) => {
    this.get(currentTabId, tab => {
      callback(tab);
    });
  };

  public query = (
    queryInfo: chrome.tabs.QueryInfo,
    callback: (tabs: chrome.tabs.Tab[]) => void,
  ) => {
    ipcRenderer.send('api-tabs-query');

    ipcRenderer.once(
      'api-tabs-query',
      (e: Electron.IpcMessageEvent, data: chrome.tabs.Tab[]) => {
        const readProperty = (obj: any, prop: string) => obj[prop];

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
    );
  };

  public create = (
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
  };

  public insertCSS = (arg1: any = null, arg2: any = null, arg3: any = null) => {
    const insertCSS = (tabId: number, details: any, callback: any) => {
      if (details.hasOwnProperty('file')) {
        details.code = readFileSync(
          join(api.runtime.getManifest().srcDirectory, details.file),
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
      this.getCurrent(tab => {
        insertCSS(tab.id, arg1, arg2);
      });
    } else if (typeof arg1 === 'number') {
      insertCSS(arg1, arg2, arg3);
    }
  };

  public executeScript = (
    arg1: any = null,
    arg2: any = null,
    arg3: any = null,
  ) => {
    const executeScript = (tabId: number, details: any, callback: any) => {
      if (details.hasOwnProperty('file')) {
        details.code = readFileSync(
          join(api.runtime.getManifest().srcDirectory, details.file),
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
      this.getCurrent(tab => {
        if (tab) {
          executeScript(tab.id, arg1, arg2);
        }
      });
    } else if (typeof arg1 === 'number') {
      executeScript(arg1, arg2, arg3);
    }
  };

  public setZoom = (
    tabId: number,
    zoomFactor: number,
    callback: () => void,
  ) => {
    ipcRenderer.send('api-tabs-setZoom', tabId, zoomFactor);

    ipcRenderer.once('api-tabs-setZoom', () => {
      if (callback) {
        callback();
      }
    });
  };

  public getZoom = (tabId: number, callback: (zoomFactor: number) => void) => {
    ipcRenderer.send('api-tabs-getZoom', tabId);

    ipcRenderer.once(
      'api-tabs-getZoom',
      (e: Electron.IpcMessageEvent, zoomFactor: number) => {
        if (callback) {
          callback(zoomFactor);
        }
      },
    );
  };

  public detectLanguage = (
    tabId: number,
    callback: (language: string) => void,
  ) => {
    ipcRenderer.send('api-tabs-detectLanguage', tabId);

    ipcRenderer.once(
      'api-tabs-detectLanguage',
      (e: Electron.IpcMessageEvent, language: string) => {
        if (callback) {
          callback(language);
        }
      },
    );
  };

  public update = () => {};
}
