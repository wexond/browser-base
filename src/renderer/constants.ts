import { remote } from 'electron';

export const BASE_PATH = remote.app.getAppPath();

// Toolbar
export const TOOLBAR_HEIGHT = 48;
export const TOOLBAR_BUTTON_WIDTH = 44;

// Tabs
export const TAB_MAX_WIDTH = 200;
export const TAB_MIN_WIDTH = 72;
export const TAB_PINNED_WIDTH = 32;

// Widths
export const WINDOWS_BUTTON_WIDTH = 45;
export const MENU_WIDTH = 300;
export const MENU_SPACE = 96;
export const MENU_CONTENT_MAX_WIDTH = 640;

// Workspaces
export const WORKSPACE_FOLDER_SIZE = 96;
export const WORKSPACE_ICON_SIZE = 16;
export const WORKSPACE_MAX_ICONS_COUNT = 9;

export const WEATHER_API_KEY = '979e1265d1057789445790a1cda05186';

export const NEWS_API_KEY = '246a3ebb9cb34dc68c9c9f6856c14ed5';

export const TIME_ZONE_API_KEY = 'AIzaSyCdSPuvolIItonMERz3EpFAeB1oH7ItfYc';

export const EASE_FUNCTION = 'cubic-bezier(0.19, 1, 0.22, 1)';
