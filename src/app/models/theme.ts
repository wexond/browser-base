import { observable } from 'mobx';
import { merge, isObject } from '../utils/objects';

export interface BaseTheme {
  style?: any;
  inherit?: string;
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
  selectedHovered?: TabHoveredTheme;
  selected?: TabTheme;
  normal?: TabTheme;
  dragging?: TabTheme;
  indicator?: BaseTheme;
  enableHoverOnSelectedTab?: boolean;
  rippleColor?: string;
}

export interface TabTheme extends BaseTheme {
  content?: {
    align?: 'left' | 'center';
    style?: any;
  };
  close?: {
    color?: 'light' | 'dark';
    style?: any;
  };
  title?: BaseTheme;
  icon?: BaseTheme;
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
  [key: string]: any;
}

export const getObjectToInherit = (inherit: string, baseObject: any) => {
  if (inherit == null) return null;

  const split = inherit.split('.');
  let objToInherit = baseObject[split[0]];

  for (let i = 1; i < split.length; i++) {
    objToInherit = objToInherit[split[i]];
  }

  return objToInherit;
};

export const inheritObjects = (object: any, baseObject: any) => {
  object = { ...object };

  if (object.inherit != null) {
    let obj = getObjectToInherit(object.inherit, baseObject);
    obj = inheritObjects(obj, baseObject);
    object = merge(object, obj);
  }

  return object;
};

export default class {
  @observable public theme: Theme = {};

  public inherit(object: any = this.theme, baseObject: any = null) {
    object = { ...object };

    if (baseObject == null) {
      baseObject = object;
    }

    if (isObject(object)) {
      const keys = Object.keys(object);

      let toInherit: string = null;

      for (const key of keys) {
        if (typeof object[key] === 'string' && key === 'inherit') {
          toInherit = object[key];
        } else if (isObject(object[key])) {
          object[key] = this.inherit(object[key], baseObject);
        }
      }

      if (toInherit != null) {
        object = inheritObjects(object, baseObject);
      }
    }

    return object;
  }

  public set(theme: Theme) {
    // Inherit themes.
    theme = this.inherit(theme);

    // Deep merge current theme with new theme.
    this.theme = merge(this.theme, theme);
  }
}
