import { CSSProperties } from 'react';
import { observable } from 'mobx';
import { merge, isObject } from '../utils/objects';

export interface BaseTheme extends CSSProperties {}

export interface TabSelectedTheme extends BaseTheme {
  enableHover?: boolean;
}

export interface TabTheme extends BaseTheme {
  rippleColor?: string;
}

export interface TabContentTheme extends BaseTheme {
  align?: 'center' | 'left';
}

export interface AddressBarInputTheme extends BaseTheme {
  placeholderColor?: string;
}

export interface ToolbarButtonsTheme extends BaseTheme {
  rippleSize?: number;
}

export interface Theme {
  app?: BaseTheme;
  toolbar?: BaseTheme;
  toolbarSeparators?: BaseTheme;
  toolbarBottomLine?: BaseTheme;
  toolbarButtons?: ToolbarButtonsTheme;

  tabsSection?: BaseTheme;
  tabbar?: BaseTheme;
  tabsIndicator?: BaseTheme;

  tab?: TabTheme;
  tabHovered?: BaseTheme;
  tabSelected?: TabSelectedTheme;
  tabSelectedHovered?: BaseTheme;
  tabDragging?: BaseTheme;

  tabContent?: TabContentTheme;
  tabHoveredContent?: TabContentTheme;
  tabSelectedContent?: TabContentTheme;
  tabSelectedHoveredContent?: TabContentTheme;
  tabDraggingContent?: TabContentTheme;

  tabTitle?: BaseTheme;
  tabHoveredTitle?: BaseTheme;
  tabSelectedTitle?: BaseTheme;
  tabSelectedHoveredTitle?: BaseTheme;
  tabDraggingTitle?: BaseTheme;

  tabClose?: BaseTheme;
  tabHoveredClose?: BaseTheme;
  tabSelectedClose?: BaseTheme;
  tabSelectedHoveredClose?: BaseTheme;
  tabDraggingClose?: BaseTheme;

  tabIcon?: BaseTheme;
  tabHoveredIcon?: BaseTheme;
  tabSelectedIcon?: BaseTheme;
  tabSelectedHoveredIcon?: BaseTheme;
  tabDraggingIcon?: BaseTheme;

  addressBar?: BaseTheme;
  addressBarInput?: AddressBarInputTheme;
  addressBarInputContainer?: BaseTheme;

  suggestions?: BaseTheme;

  suggestion?: BaseTheme;
  suggestionHovered?: BaseTheme;
  suggestionSelected?: BaseTheme;

  suggestionIcon?: BaseTheme;
  suggestionHoveredIcon?: BaseTheme;
  suggestionSelectedIcon?: BaseTheme;

  addTabButton?: BaseTheme;

  accentColor?: string;
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
    object = merge(obj, object);
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
