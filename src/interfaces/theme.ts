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

  'dialog.separator.color': string;
  'dialog.backgroundColor': string;
  'dialog.textColor': string;
  'dialog.lightForeground': boolean;

  'searchBox.input.textColor': string;
  'searchBox.input.lightForeground': boolean;
  'searchBox.input.backgroundColor': string;

  'searchBox.subHeading.backgroundColor': string;
  'searchBox.subHeading.textColor': string;

  'searchBox.suggestions.textColor': string;
  'searchBox.suggestions.backgroundColor': string;
  'searchBox.suggestions.lightForeground': boolean;

  'pages.backgroundColor': string;
  'pages.lightForeground': boolean;
  'pages.textColor': string;
  'pages.navigationDrawer1.backgroundColor': string;
  'pages.navigationDrawer2.backgroundColor': string;

  'dropdown.backgroundColor': string;
  'dropdown.backgroundColor.translucent': string;
  'dropdown.separator.color': string;

  backgroundColor: string;
  accentColor: string;

  animations?: boolean;

  dark?: boolean;
}
