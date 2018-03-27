import { ToolbarTheme } from './theme';

export default interface PluginAPI {
  toolbar?: ToolbarTheme;
  toolbarDividersColor?: string;
  accentColor?: string;
}; // eslint-disable-line
