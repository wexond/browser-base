export type BrowserActionChangeType =
  | 'setPopup'
  | 'setBadgeText'
  | 'setTitle'
  | 'setIcon'
  | 'setBadgeBackgroundColor';

export const BROWSER_ACTION_METHODS: BrowserActionChangeType[] = [
  'setPopup',
  'setBadgeText',
  'setTitle',
  'setIcon',
  'setBadgeBackgroundColor',
];

// TODO(sentialx): remove after upgrading to Electron 10
export interface Electron10Extension extends Electron.Extension {
  manifest: chrome.runtime.Manifest;
  path: string;
}
