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
}
