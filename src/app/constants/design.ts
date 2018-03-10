import { platform } from "os";
import { Platforms } from "../../shared/enums";

// Heights
export const SYSTEM_BAR_HEIGHT = platform() === Platforms.MacOS ? 36 : 32;

// Widths
export const SYSTEM_BAR_WINDOWS_BUTTON_WIDTH = 45;
export const TAB_MAX_WIDTH = 210;
export const TAB_MIN_WIDTH = 60;
export const TAB_PINNED_WIDTH = 32;

// Animations
export const HOVER_DURATION = 0.2;
