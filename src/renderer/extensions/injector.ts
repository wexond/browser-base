import { getAPI } from './api';
import { webFrame, ipcRenderer } from 'electron';
import { IpcEvent } from './ipc-event';
import { ipcInvoker } from './ipc-invoker';

declare const chrome: any;
declare let browser: any;

export const injectAPI = async (webUi: boolean) => {
  const api = getAPI();

  if (webUi) {
    api.ipcRenderer = ipcRenderer;

    api.browserAction = {
      getAllInTab: ipcInvoker('browserAction.getAllInTab'),
      showPopup: ipcInvoker('browserAction.showPopup'),
      onUpdated: new IpcEvent('browserAction.onUpdated'),
    };

    const w = await webFrame.executeJavaScript('window');
    w.browser = api;
  } else {
    Object.assign(chrome, api);
    Object.freeze(chrome);
  }
};
