import { ITheme } from '~/interfaces';
import { colors } from './colors';

export const lightTheme: ITheme = {
  'toolbar.backgroundColor': '#fff',
  'toolbar.bottomLine.backgroundColor': 'rgba(0, 0, 0, 0.12)',
  'toolbar.lightForeground': false,
  'toolbar.separator.color': 'rgba(0, 0, 0, 0.12)',
  'tab.backgroundOpacity': 0.7,
  'tab.selectedHover.backgroundOpacity': 0.65,
  'tab.hover.backgroundOpacity': 0.9,
  'tab.selected.textColor': '#000',
  'tab.textColor': `rgba(0, 0, 0, 0.7)`,
  'tab.allowLightBackground': false,
  'control.backgroundColor': 'rgba(0, 0, 0, 0.08)',
  'control.hover.backgroundColor': 'rgba(0, 0, 0, 0.1)',
  'control.valueColor': '#000',
  'control.lightIcon': false,
  'switch.backgroundColor': 'rgba(0, 0, 0, 0.16)',
  accentColor: colors.blue['500'],
  backgroundColor: '#fff',
};

export const darkTheme: ITheme = {
  'toolbar.backgroundColor': '#1c1c1c',
  'toolbar.bottomLine.backgroundColor': '#000',
  'toolbar.lightForeground': true,
  'toolbar.separator.color': 'rgba(255, 255, 255, 0.12)',
  'tab.backgroundOpacity': 0.6,
  'tab.hover.backgroundOpacity': 0.5,
  'tab.selectedHover.backgroundOpacity': 0.45,
  'tab.selected.textColor': '#fff',
  'tab.textColor': 'rgba(255, 255, 255, 0.54)',
  'tab.allowLightBackground': true,
  'control.backgroundColor': 'rgba(255, 255, 255, 0.1)',
  'control.hover.backgroundColor': 'rgba(255, 255, 255, 0.12)',
  'control.valueColor': '#fff',
  'control.lightIcon': true,
  'switch.backgroundColor': 'rgba(255, 255, 255, 0.24)',
  backgroundColor: '#1c1c1c',
  accentColor: colors.blue['500'],
};
