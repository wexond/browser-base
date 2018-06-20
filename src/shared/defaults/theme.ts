import { Theme } from '../models/theme';
import colors from '../../shared/defaults/colors';
import opacity from '../../shared/defaults/opacity';

/*
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
    placeholderColor: `rgba(0, 0, 0, ${opacity.light.secondaryText})`,
  },
  suggestions: {
    item: {
      normal: {},
      selected: {
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
        inherit: 'suggestions.item.normal',
      },
      hovered: {
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        inherit: 'suggestions.item.normal',
      },
    },
  },
  tabsSection: {},
  addTabButton: {},
  tabbar: {},
} as Theme; */

const tabContentTheme = {
  align: 'center',
};

const tabHoveredTheme = {
  background: 'rgba(0, 0, 0, 0.08)',
};

const tabSelectedTitleTheme = {
  color: colors.blue['500'],
};

const tabTheme = {};

export default {
  toolbar: {},
  toolbarButtons: {
    rippleSize: 42,
  },

  addressBarInput: {},

  tab: {},
  tabHovered: tabHoveredTheme,
  tabSelected: {
    enableHover: true,
  },
  tabSelectedHovered: tabHoveredTheme,
  tabDragging: {},

  tabContent: tabContentTheme,
  tabSelectedContent: tabContentTheme,
  tabHoveredContent: tabContentTheme,
  tabDraggingContent: tabContentTheme,
  tabSelectedHoveredContent: tabContentTheme,

  tabTitle: {},
  tabSelectedTitle: tabSelectedTitleTheme,
  tabHoveredTitle: {},
  tabDraggingTitle: {},
  tabSelectedHoveredTitle: tabSelectedTitleTheme,

  tabsIndicator: {
    backgroundColor: colors.blue['500'],
  },

  suggestion: {},
  suggestionHovered: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  suggestionSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },

  suggestionIcon: {
    opacity: opacity.light.activeIcon,
  },
  suggestionHoveredIcon: {
    opacity: opacity.light.activeIcon,
  },

  accentColor: colors.blue['500'],
} as Theme;
