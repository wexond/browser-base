import { NEWTAB_URL } from '@/constants/app';

export const defaultAddTabOptions: chrome.tabs.CreateProperties = {
  url: NEWTAB_URL,
  active: true,
};
