export interface ITheme {
  'toolbar.backgroundColor': string;
  'toolbar.bottomLine.backgroundColor': string;
  'toolbar.lightForeground': boolean;
  'toolbar.separator.color': string;

  'tab.backgroundOpacity': number;
  'tab.selectedHover.backgroundOpacity': number;
  'tab.hover.backgroundOpacity': number;
  'tab.selected.textColor': string;
  'tab.textColor': string;
  'tab.allowLightBackground': boolean;

  'control.backgroundColor': string;
  'control.hover.backgroundColor': string;
  'control.valueColor': string;
  'control.lightIcon': boolean;
  'switch.backgroundColor': string;

  'menu.separator.color': string;
  'menu.backgroundColor': string;
  'menu.header.background': string;
  'menu.textColor': string;
  'menu.lightForeground': boolean;

  'searchBox.input.textColor': string;
  'searchBox.input.lightForeground': boolean;
  'searchBox.input.backgroundColor': string;

  'searchBox.subHeading.backgroundColor': string;
  'searchBox.subHeading.textColor': string;

  'searchBox.suggestions.textColor': string;
  'searchBox.suggestions.backgroundColor': string;
  'searchBox.suggestions.lightForeground': boolean;

  backgroundColor: string;
  accentColor: string;
}
