export const NEWTAB_URL =
  process.env.ENV === 'dev'
    ? 'http://localhost:8080/newtab.html'
    : 'wexond://newtab';

export const defaultTabOptions: chrome.tabs.CreateProperties = {
  url: NEWTAB_URL,
  active: true,
};
