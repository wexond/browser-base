import { Theme } from '../../shared/models/theme';
import colors from '../../shared/defaults/colors';
import opacity from '../../shared/defaults/opacity';

const tabContentTheme = {
  align: 'center',
};

const tabHoveredTheme = {
  background: 'rgba(0, 0, 0, 0.08)',
};

const tabSelectedTitleTheme = {
  color: colors.blue['500'],
};

export default {
  toolbar: {},
  toolbarButtons: {
    rippleSize: 36,
  },

  addressBarInput: {
    placeholderColor: `rgba(0, 0, 0, ${opacity.light.secondaryText})`,
  },

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
  tabDraggingTitle: tabSelectedTitleTheme,
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
