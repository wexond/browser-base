import { webFrame } from 'electron';
import { getWexondAPI } from '../internal/wexond-api';
import { getChromeAPI } from './api';

declare const chrome: any;
declare let browser: any;

export const injectAPI = async (webUi: boolean) => {
  if (webUi) {
    const w = await webFrame.executeJavaScript('window');
    w.browser = getWexondAPI();
  } else {
    const api = getChromeAPI();
    Object.assign(chrome, api);
    Object.freeze(chrome);
  }
};
