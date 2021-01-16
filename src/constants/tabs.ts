import { getWebUIURL } from '~/common/webui';

export const NEWTAB_URL = getWebUIURL('newtab');

export const defaultTabOptions: chrome.tabs.CreateProperties = {
  url: NEWTAB_URL,
  active: true,
};
