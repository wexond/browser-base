import { observable } from 'mobx';
import { colors } from 'nersent-ui';

export interface ToolbarDividersTheme {
  color?: string;
}

export interface ToolbarTheme {
  background?: string;
  foreground?: 'dark' | 'light';
  align?: 'left' | 'right' | 'top' | 'bottom';
  shadow?: boolean | string;
}

export interface SearchBarTheme {
  background?: 'dark' | 'light';
}

export default class Theme {
  @observable
  public toolbar: ToolbarTheme = {
    background: '#fafafa',
    foreground: 'light',
    align: 'top',
    shadow: false,
  };
  @observable
  public searchBar: SearchBarTheme = {
    background: 'dark',
  };
  @observable public accentColor = colors.blue['500'];
} // eslint-disable-line
