export interface Theme {
  'toolbar.backgroundColor': string;
  'toolbar.bottomLine.backgroundColor': string;
  'toolbar.icons.invert': boolean;
  'toolbar.separator.color': string;
  'tab.backgroundOpacity': number;
  'tab.selectedHover.backgroundOpacity': number;
  'tab.hover.backgroundColor': string;
  'tab.selected.textColor': string;
  'tab.textColor': string;
  'tab.allowLightBackground': boolean;
  'overlay.windowsButtons.invert': boolean;
  'overlay.backgroundColor': string;
  'overlay.section.backgroundColor': string;
  'overlay.foreground': 'light' | 'dark';
  'overlay.dialog.backgroundColor': string;
  'overlay.separator.color': string;
  accentColor: string;
}
