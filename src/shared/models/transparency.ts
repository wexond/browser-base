import opacity from '../defaults/opacity';

export const TransparencyComponent = {
  light: {
    disabled: opacity.light.disabledControl,
    inactive: opacity.light.inactiveControl,
    active: 1,
  },
  dark: {
    disabled: opacity.dark.disabledControl,
    inactive: opacity.dark.inactiveControl,
    active: 1,
  },
};

export const TransparencyText = {
  light: {
    disabled: opacity.light.disabledText,
    inactive: opacity.light.secondaryText,
    active: opacity.light.primaryText,
  },
  dark: {
    disabled: opacity.dark.disabledText,
    inactive: opacity.dark.secondaryText,
    active: opacity.dark.primaryText,
  },
};
