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
