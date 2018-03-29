import { observable } from 'mobx';
import { colors } from 'nersent-ui';
import { TOOLBAR_HEIGHT, TOOLBAR_BUTTON_WIDTH } from '../constants/design';

export interface ToolbarDividersTheme {
  color?: string;
}

export interface ToolbarButtonsTheme {
  rippleSize?: number;
  width?: number;
}

export interface ToolbarTheme {
  background?: string;
  foreground?: 'dark' | 'light';
  align?: 'left' | 'right' | 'top' | 'bottom';
  shadow?: boolean | string;
  indicatorVisible?: boolean;
  bottomDividerVisible?: boolean;
  separatorsVisible?: boolean;
  height?: number;
}

export interface SearchBarTheme {
  background?: 'dark' | 'light';
  height?: number;
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
    rippleColor: '',
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
  toolbarButtons: ToolbarButtonsTheme = {
    width: TOOLBAR_BUTTON_WIDTH,
    rippleSize: 42,
  };
  @observable public accentColor = colors.blue['500'];
} // eslint-disable-line
