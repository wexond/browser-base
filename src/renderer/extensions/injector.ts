import { webFrame, ipcRenderer } from 'electron';
import { getAPI } from './api';

declare const chrome: any;
declare let browser: any;

export const injectAPI = async (webUi: boolean) => {
  const api = getAPI(webUi ? 'webui' : 'blessed_extension');

  if (webUi) {
    const w = await webFrame.executeJavaScript('window');

    ipcRenderer.on('main-message', (e, message: any) => {
      console.log(message);
    });
    w.browser = api;
    w.browser.ipcRenderer = ipcRenderer;
  } else {
    Object.assign(chrome, api);
    Object.freeze(chrome);
  }
};
