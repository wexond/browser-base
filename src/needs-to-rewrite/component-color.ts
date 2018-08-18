type UITheme = 'light' | 'dark';

export const getComponentColor = (
  color: string,
  toggled: boolean,
  disabled: boolean,
  theme: UITheme,
  returnOnlyAlpha: boolean = false,
) => {
  const isLightTheme = theme === 'light';
  const rgb = isLightTheme ? 0 : 255;

  let alpha;

  if (disabled) {
    alpha = isLightTheme
      ? transparency.light.disabledIcon
      : transparency.dark.disabledIcon;
  } else if (!toggled) {
    alpha = isLightTheme
      ? transparency.light.inactiveIcon
      : transparency.dark.inactiveIcon;
  }

  if (returnOnlyAlpha) {
    return alpha;
  }
  return alpha != null ? `rgba(${rgb}, ${rgb}, ${rgb}, ${alpha})` : color;
};

export const getComponentRippleColor = (
  color: string,
  toggled: boolean,
  theme: UITheme,
) => {
  if (toggled) {
    return color;
  }
  return theme === 'light' ? '#000' : '#fff';
};

export const getComponentOpacity = (
  toggled: boolean,
  disabled: boolean,
  theme: UITheme,
  background: boolean = true,
  transparency?: any,
) => getComponentColor(null, toggled, disabled, theme, true);

export const getComponentForeground = (disabled: boolean, theme: UITheme) => {
  if (disabled) {
    if (theme === 'light') {
      return `rgba(0,0,0,${transparency.light.disabledIcon})`;
    }
    return `rgba(255,255,255,${transparency.dark.disabledIcon})`;
  }
  if (theme === 'light') {
    return `rgba(0,0,0,${transparency.light.inactiveIcon})`;
  }
  return `rgba(255,255,255,${transparency.dark.inactiveIcon})`;
};
