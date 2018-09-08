export const NEWTAB_URL =
  process.env.ENV === 'dev'
    ? 'http://localhost:8080/newtab.html'
    : 'wexond://newtab';

export const defaultAddTabOptions: chrome.tabs.CreateProperties = {
  url: NEWTAB_URL,
  active: true,
};
