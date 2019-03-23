import { ipcRenderer } from 'electron';
import { API } from '.';

let api: API;

// https://developer.chrome.com/extensions/browserAction

export class BrowserAction {
  public onClicked = {
    addListener: () => {},
  };

  constructor(_api: API) {
    api = _api;
  }

  public setIcon = (details: chrome.browserAction.TabIconDetails, cb: any) => {
    if (cb) cb();
  };

  public setBadgeBackgroundColor = (
    details: chrome.browserAction.BadgeBackgroundColorDetails,
    cb: any,
  ) => {
    if (cb) cb();
  };

  public setBadgeText = (
    details: chrome.browserAction.BadgeTextDetails,
    cb: any,
  ) => {
    ipcRenderer.send('api-browserAction-setBadgeText', api.runtime.id, details);

    if (cb) {
      ipcRenderer.once('api-browserAction-setBadgeText', () => {
        cb();
      });
    }
  };
}
