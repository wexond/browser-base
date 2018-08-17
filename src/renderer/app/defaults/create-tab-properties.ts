import { NEWTAB_URL } from '../../../constants';

export const defaultCreateTabProperties: chrome.tabs.CreateProperties = {
  url: NEWTAB_URL,
  active: true,
};
