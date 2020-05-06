import { getAPI } from './api';
import { contextBridge, webFrame, ipcRenderer } from 'electron';

declare const chrome: any;
declare let browser: any;

export const injectAPI = async (webUi: boolean) => {
  const api = getAPI();

  if (webUi) {
    api.send = (channel: string, ...args: any[]) =>
      ipcRenderer.send(channel, ...args);

    const w = await webFrame.executeJavaScript('window');
    w.browser = api;
  } else {
    Object.assign(chrome, api);
    Object.freeze(chrome);
  }
};
