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
      icon: {},
      title: {},
      close: {
        color: 'dark',
      },
    },
    selected: {
      title: {
        style: {
          color: colors.blue['500'],
        },
      },
      inherit: 'tabs.normal',
    },
    hovered: {
      background: 'rgba(0, 0, 0, 0.08)',
      inherit: 'tabs.normal',
    },
    selectedHovered: {
      title: {
        style: {
          color: colors.blue['500'],
        },
      },
      inherit: 'tabs.hovered',
    },
    dragging: {
      style: {
        backgroundColor: '#fff',
      },
      inherit: 'tabs.selected',
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
