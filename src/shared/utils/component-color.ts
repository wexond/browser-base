import { UITheme } from '../enums';

import { TransparencyComponent, TransparencyText } from '../models/transparency';

export const getComponentBackground = (
  color: string,
  toggled: boolean,
  disabled: boolean,
  theme: UITheme,
  transparency?: TransparencyComponent,
) => {
  const { light, dark } = transparency;
  const isLightTheme = theme === UITheme.Light;

  let alpha = isLightTheme ? light.active : dark.active;
  let rgb = 0;

  if (disabled) {
    alpha = isLightTheme ? light.disabled : dark.disabled;
  } else if (toggled != null && !toggled) {
    alpha = isLightTheme ? light.inactive : dark.inactive;
  }

  rgb = isLightTheme ? 255 : 0;
  return `rgba(${rgb}, ${rgb}, ${rgb}, ${alpha}`;
};
/*
export const getComponentForeground = (
  disabled: boolean,
  theme: UITheme,
  transparency?: TransparencyText,
) => {
  if (disabled) {
    if (theme === Theme.Light) {
      return `rgba(0,0,0,${opacity.disabled.light})`;
    }
    return `rgba(255,255,255,${opacity.disabled.dark})`;
  }
  if (theme === Theme.Light) {
    return `rgba(0,0,0,${opacity.enabled.light})`;
  }
  return `rgba(255,255,255,${opacity.enabled.dark})`;
};

export const getComponentRippleColor = (flag, color, theme) => {
  if (flag) {
    return color;
  }
  if (theme === Theme.Light) {
    return '#000';
  }
  return '#fff';
};
*/
