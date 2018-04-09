import { observable } from 'mobx';
import { merge } from '../utils/objects';

export interface BaseTheme {
  style?: any;
}

export interface ToolbarButtonsTheme extends BaseTheme {
  rippleSize?: number;
  color?: 'light' | 'dark';
}

export interface ToolbarTheme extends BaseTheme {
  bottomDivider?: BaseTheme;
  separators?: BaseTheme;
}

export interface TabsTheme extends BaseTheme {
  hovered?: TabHoveredTheme;
  selected?: TabTheme;
  normal?: TabTheme;
  dragging?: TabTheme;
  indicator?: BaseTheme;
  enableHoverOnSelectedTab?: boolean;
  rippleColor?: string;
}

export interface TabTheme extends BaseTheme {
  content?: {
    title?: BaseTheme;
    icon?: BaseTheme;
    align?: 'left' | 'center';
  };
  close?: {
    color?: 'light' | 'dark';
    style?: any;
  };
}

export interface TabHoveredTheme extends TabTheme {
  background?: string;
}

export interface SearchBarTheme extends BaseTheme {
  placeholderColor?: string;
}

export interface Theme {
  toolbar?: ToolbarTheme;
  tabs?: TabsTheme;
  toolbarButtons?: ToolbarButtonsTheme;
  searchBar?: SearchBarTheme;
  accentColor?: string;
  tabbar?: BaseTheme;
  suggestions?: BaseTheme;
  addTabButton?: BaseTheme;
  tabsSection?: BaseTheme;
}

export default class {
  @observable public theme: Theme = {};

  public set(theme: Theme) {
    const initialTheme = { ...this.theme.tabs };

    this.theme.tabs = {
      ...this.theme.tabs,
      hovered: {},
      selected: {},
      normal: {},
      dragging: {},
    };

    // Deep merge current theme with new theme.
    this.theme = merge(this.theme, theme);

    // Inherit from normal tab only not existing properties.
    this.theme.tabs.hovered = merge(this.theme.tabs.hovered, this.theme.tabs.normal, true);
    this.theme.tabs.selected = merge(this.theme.tabs.selected, this.theme.tabs.normal, true);
    // Inherit from selected tab only not existing properties.
    this.theme.tabs.dragging = merge(this.theme.tabs.dragging, this.theme.tabs.selected, true);

    // Inherit from initialTheme only not existing properties.
    this.theme.tabs.hovered = merge(this.theme.tabs.hovered, initialTheme.hovered, true);
    this.theme.tabs.normal = merge(this.theme.tabs.normal, initialTheme.normal, true);
    this.theme.tabs.dragging = merge(this.theme.tabs.dragging, initialTheme.dragging, true);
    this.theme.tabs.selected = merge(this.theme.tabs.selected, initialTheme.selected, true);
  }
}
