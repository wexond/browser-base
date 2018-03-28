import { observable } from 'mobx';
import { transparency, colors } from 'nersent-ui';

export interface ToolbarDividersTheme {
  color?: string;
}

export interface ToolbarTheme {
  background?: string;
  foreground?: 'black' | 'white';
  align?: 'left' | 'right' | 'top' | 'bottom';
}

export default class Theme {
  @observable
  public toolbar: ToolbarTheme = {
    background: '#fafafa',
    foreground: 'black',
    align: 'top',
  };
  @observable public toolbarDividersColor = `rgba(0, 0, 0, ${transparency.light.dividers})`;
  @observable public accentColor = colors.blue['500'];
} // eslint-disable-line
