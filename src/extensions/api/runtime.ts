import { format } from 'url';
import { ipcRenderer } from 'electron';
import { makeId } from '~/shared/utils/string';
import { Port, ApiEvent } from '..';
import { API } from '.';

// https://developer.chrome.com/extensions/runtime

let api: API;
let currentTabId: number = null;

export class Runtime {
  public id: string;

  public lastError: chrome.runtime.LastError; // TODO

  public onConnect = new ApiEvent();

  constructor(_api: API, tabId: number) {
    api = _api;
    this.id = api._extension.id;
    currentTabId = tabId;
  }

  public connect = (arg1: string | any = null, arg2: any = null) => {
    const sender: any = {
      id: this.id,
      url: window.location.href,
      frameId: 0,
    };

    if (currentTabId !== null) {
      sender.tab = currentTabId;
    }

    const portId = makeId(32);

    let name: string = null;
    let extensionId: string = this.id;

    if (typeof arg1 === 'string') {
      extensionId = arg1;

      if (arg2 && typeof arg2 === 'object') {
        if (arg2.includeTlsChannelId) {
          sender.tlsChannelId = portId;
        }
        name = arg2.name;
      }
    } else if (arg1 && typeof arg1 === 'object') {
      if (arg1.includeTlsChannelId) {
        sender.tlsChannelId = portId;
      }
      name = arg1.name;
    }

    ipcRenderer.send('api-runtime-connect', {
      extensionId,
      portId,
      sender,
      name,
    });

    return new Port(portId, name);
  };

  public reload = () => {
    ipcRenderer.send('api-runtime-reload', this.id);
  };

  public getURL = (path: string) => {
    return format({
      protocol: 'wexond-extension',
      slashes: true,
      hostname: this.id,
      pathname: path,
    });
  };

  public getManifest = () => {
    return api._extension.manifest;
  };
}
