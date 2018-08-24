import { NEWTAB_URL } from '~/constants';

export const defaultAddTabOptions: chrome.tabs.CreateProperties = {
  url: NEWTAB_URL,
  active: true,
};
