import { getWebUIURL } from '~/common/utils/protocols';

export const NEWTAB_URL = getWebUIURL('newtab');

export const defaultTabOptions: chrome.tabs.CreateProperties = {
  url: NEWTAB_URL,
  active: true,
};
