import { colors, transparency } from 'nersent-ui';
import { Theme } from '../models/theme';

export default {
  toolbar: {
    bottomDivider: {},
    separators: {},
  },
  tabs: {
    normal: {
      content: {
        align: 'center',
      },
      close: {
        color: 'dark',
      },
    },
    hovered: {
      background: 'rgba(0, 0, 0, 0.08)',
    },
    dragging: {
      style: {
        backgroundColor: '#fff',
      },
    },
    indicator: {},
    enableHoverOnSelectedTab: true,
  },
  toolbarButtons: {
    rippleSize: 42,
    color: 'dark',
  },
  accentColor: colors.blue['500'],
  searchBar: {
    placeholderColor: `rgba(0, 0, 0, ${transparency.light.text.secondary})`,
  },
  suggestions: {},
  tabsSection: {},
  addTabButton: {},
  tabbar: {},
} as Theme;
