import { observable } from 'mobx';
import { colors } from 'nersent-ui';
import { TOOLBAR_BUTTON_WIDTH, TOOLBAR_HEIGHT } from '../constants/design';

export interface ToolbarDividersTheme {
  color?: string;
}

export interface ToolbarButtonsTheme {
  rippleSize?: number;
  width?: number;
}

export interface ToolbarTheme {
  background?: string;
  foreground?: string;
  align?: 'left' | 'right' | 'top' | 'bottom';
  shadow?: boolean | string;
  indicatorVisible?: boolean;
  bottomDividerVisible?: boolean;
  separatorsVisible?: boolean;
  height?: number;
}

export interface SuggestionsTheme {
  background?: string;
  foreground?: string;
}

export interface SearchBarTheme {
  background?: string;
  foreground?: string;
  height?: number;
}

export interface AddTabButtonTheme {
  marginLeft: number;
}

export interface TabsTheme {
  hovered?: {
    background?: string;
    foreground?: string;
  };
  selected?: {
    background?: string;
    foreground?: string;
  };
  normal?: {
    background?: string;
    foreground?: string;
  };
  dragging?: {
    background?: string;
    foreground?: string;
  };
  content?: {
    align?: 'left' | 'center';
  };
  enableHoverOnSelectedTab?: boolean;
  rippleColor?: string;
}

export interface TabbarTheme {
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  margin?: string;
}

export default class Theme {
  @observable
  public toolbar: ToolbarTheme = {
    background: '#fafafa',
    foreground: 'dark',
    align: 'top',
    shadow: false,
    indicatorVisible: true,
    bottomDividerVisible: true,
    separatorsVisible: true,
    height: TOOLBAR_HEIGHT,
  };

  @observable
  public searchBar: SearchBarTheme = {
    background: 'dark',
    foreground: 'dark',
    height: 32,
  };

  @observable
  public tabs: TabsTheme = {
    hovered: {
      background: 'dark',
      foreground: 'dark',
    },
    selected: {
      background: 'none',
      foreground: 'dark',
    },
    normal: {
      background: 'none',
      foreground: 'dark',
    },
    dragging: {
      background: 'none',
      foreground: 'dark',
    },
    content: {
      align: 'center',
    },
    enableHoverOnSelectedTab: true,
    rippleColor: '',
  };

  @observable
  public addTabButton: AddTabButtonTheme = {
    marginLeft: 0,
  };

  @observable
  public tabbar: TabbarTheme = {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    margin: null,
  };

  @observable
  public toolbarButtons: ToolbarButtonsTheme = {
    width: TOOLBAR_BUTTON_WIDTH,
    rippleSize: 42,
  };

  @observable
  public suggestions: SuggestionsTheme = {
    background: '#fff',
    foreground: 'dark',
  };

  @observable public accentColor = colors.blue['500'];

  public set(object2: any, object1: any = this, objectName = '') {
    for (const key in object1) {
      const newName = `${objectName}.${key}`;

      if (object2[key] != null) {
        if (typeof object2[key] !== 'object') {
          object1[key] = object2[key];
        } else {
          this.set(object2[key], object1[key], newName);
        }
      } else if (
        newName === '.tabs.hovered.foreground' ||
        newName === '.tabs.normal.foregrond' ||
        newName === '.tabs.selected.foreground' ||
        newName === '.searchBar.foreground'
      ) {
        // Inherit foregrounds from toolbar foreground
        // if the custom theme hasn't foregrounds set.
        object1[key] = this.toolbar.foreground;
      } else if (
        newName === '.tabs.hovered' ||
        newName === '.tabs.normal' ||
        newName === '.tabs.selected' ||
        newName === '.searchBar'
      ) {
        object1[key] = {
          foreground: this.toolbar.foreground,
        };
      }
    }
  }
}
