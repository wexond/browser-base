export const NEWTAB_URL = 'about:blank';

export const defaultTabOptions: chrome.tabs.CreateProperties = {
  url: NEWTAB_URL,
  active: true,
};
