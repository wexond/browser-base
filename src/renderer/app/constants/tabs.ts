import { Power2 } from 'gsap';

export const NEWTAB_URL = 'about:blank';

export const defaultTabOptions: chrome.tabs.CreateProperties = {
  url: NEWTAB_URL,
  active: true,
};

export const TAB_MAX_WIDTH = 200;
export const TAB_MIN_WIDTH = 72;
export const TAB_PINNED_WIDTH = 32;
export const TAB_ANIMATION_DURATION = 0.3;
export const TAB_ANIMATION_EASING = Power2.easeOut;
export const TABS_PADDING = 2;
