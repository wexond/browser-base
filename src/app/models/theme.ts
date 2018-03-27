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
  public toolbar: ToolbarTheme = {
    background: '#fafafa',
    foreground: 'black',
    align: 'top',
  };
  public toolbarDividersColor: string = `rgba(0, 0, 0, ${transparency.light.dividers})`;
  public accentColor: string = colors.blue['500'];
}
