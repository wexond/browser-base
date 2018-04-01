import Theme from './theme';

export default interface PluginAPI {
  setTheme?: () => Theme;
}; // eslint-disable-line
