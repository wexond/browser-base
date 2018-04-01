import { transparency } from 'nersent-ui';

export const getForegroundColor = (
  type: 'text-primary' | 'text-secondary' | 'dividers' | 'icon-inactive',
  { foreground }: any,
  customForeground = true,
) => {
  if (foreground === 'dark' || foreground === 'light') {
    let opacity = 1;
    const alpha = transparency[foreground as 'dark' | 'light'];
    if (type === 'text-primary') {
      opacity = alpha.text.primary;
    } else if (type === 'text-secondary') {
      opacity = alpha.text.secondary;
    } else if (type === 'dividers') {
      opacity = alpha.dividers;
    } else if (type === 'icon-inactive') {
      opacity = alpha.icons.inactive;
    }

    return foreground === 'light' ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
  }

  if (customForeground) {
    return foreground;
  }

  return null;
};

export const getBackgroundColor = (
  type: 'tab-hover' | 'search-bar',
  { background }: any,
  customBackground = true,
) => {
  if (background === 'dark' || background === 'light') {
    let opacity = 1;
    const alpha = transparency[background as 'dark' | 'light'];
    if (type === 'tab-hover') {
      opacity = alpha.dividers;
    } else if (type === 'search-bar') {
      opacity = alpha.dividers;
    }

    return background === 'light' ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
  }

  if (customBackground) {
    return background;
  }

  return null;
};
