import { WEBUI_BASE_URL, WEBUI_URL_SUFFIX } from './files';

export const NEWTAB_URL = `${WEBUI_BASE_URL}newtab${WEBUI_URL_SUFFIX}`;

export const defaultTabOptions: chrome.tabs.CreateProperties = {
  url: NEWTAB_URL,
  active: true,
};
