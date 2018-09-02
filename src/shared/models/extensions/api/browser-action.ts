import { ipcRenderer } from 'electron';
import { API_BROWSER_ACTION_SET_BADGE_TEXT } from '@/constants/extensions';
import { API } from '.';

let api: API;

// https://developer.chrome.com/extensions/browserAction

export class BrowserAction {
  public onClicked = {
    addListener: () => {},
  };

  // tslint:disable-next-line
  constructor(_api: API) {
    api = _api;
  }

  public setIcon(details: chrome.browserAction.TabIconDetails, cb: any) {
    if (cb) cb();
  }

  public setBadgeBackgroundColor(
    details: chrome.browserAction.BadgeBackgroundColorDetails,
    cb: any,
  ) {
    if (cb) cb();
  }

  public setBadgeText(details: chrome.browserAction.BadgeTextDetails, cb: any) {
    ipcRenderer.send(
      API_BROWSER_ACTION_SET_BADGE_TEXT,
      api.runtime.id,
      details,
    );

    if (cb) {
      ipcRenderer.once(API_BROWSER_ACTION_SET_BADGE_TEXT, () => {
        cb();
      });
    }
  }
}
