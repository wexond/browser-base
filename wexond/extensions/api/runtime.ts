import { format } from 'url';
import { ipcRenderer } from 'electron';
import { makeId } from '~/shared/utils/string';
import { Port, ApiEvent } from '..';
import { API } from '.';

// https://developer.chrome.com/extensions/runtime

let api: API;
let currentTabId: number = null;

const getSender = (id: string): chrome.runtime.MessageSender => ({
  id,
  url: window.location.href,
  frameId: 0,
  tab: { id: currentTabId } as any,
});

export class Runtime {
  public id: string;

  public lastError: chrome.runtime.LastError; // TODO

  public onConnect = new ApiEvent();
  public onMessage = new ApiEvent();

  constructor(_api: API, tabId: number) {
    api = _api;
    this.id = api._extension.id;
    currentTabId = tabId;
  }

  public sendMessage = (...args: any[]) => {
    const sender = getSender(this.id);
    const portId = makeId(32);

    let extensionId = args[0];
    let message = args[1];
    let options = args[2];
    let responseCallback = args[3];

    if (typeof args[0] === 'object') {
      message = args[0];
      extensionId = this.id;
    }

    if (typeof args[1] === 'object') {
      options = args[1];
    }

    if (typeof args[1] === 'function') {
      responseCallback = args[1];
    }

    if (typeof args[2] === 'function') {
      responseCallback = args[2];
    }

    if (options && options.includeTlsChannelId) {
      sender.tlsChannelId = portId;
    }

    if (typeof responseCallback === 'function') {
      ipcRenderer.on(
        `api-runtime-sendMessage-response-${portId}`,
        (e: Electron.IpcMessageEvent, res: any) => {
          responseCallback(res);
        },
      );
    }

    ipcRenderer.send('api-runtime-sendMessage', {
      extensionId,
      portId,
      sender,
      message,
    });
  };

  public connect = (arg1: string | any = null, arg2: any = null) => {
    const sender = getSender(this.id);
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
