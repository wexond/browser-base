
import { TweenLite } from "gsap";

import Store from "../store";

import { tabAnimations } from "../defaults/tabs";

import {
  SYSTEM_BAR_HEIGHT,
  TAB_MAX_WIDTH,
  TAB_MIN_WIDTH,
  TAB_PINNED_WIDTH,
  TABBAR_BUTTON_WIDTH
} from "../constants/design";

import { IAddTabButton, ITab, ITabGroup } from "../interfaces";

import { addPage } from "./pages";

let nextTabId = 0;
let widths: number[] = [];

export const getScrollingMode = (tabGroup: ITabGroup): boolean => {
  for (const tab of tabGroup.tabs) {
    if (!tab.pinned) {
      const width = getTabWidth(tab);
      return width <= TAB_MIN_WIDTH;
    }
  }
};

export const animateTab = (tab: ITab, property: "width" | "left", value: number) => {
  const { easing, duration } = tabAnimations[property];

  TweenLite.to(tab, duration, {
    [property]: value,
    ease: easing
  })
}

export const animateAddTabButton = (left: number) => {
  const { easing, duration } = tabAnimations.left;

  TweenLite.to(Store.addTabButton, duration, {
    left,
    ease: easing
  })
}

export const setTabsPositions = (
  animation = true
) => {
  const tabGroup = Store.tabGroups[Store.selectedTabGroup];
  const { tabs } = tabGroup;
  const newTabs = tabs.filter(tab => !tab.isRemoving);
  const containerWidth = Store.getTabBarWidth();

  let left = 0;

  for (const item of newTabs) {
    if (item.left !== left) {
      if (animation) {
        animateTab(item, "left", left);
      } else {
        item.left = left;
      }
    }
    item.newLeft = left;
    left += item.newWidth;
  }
  
  if (left >= containerWidth - TABBAR_BUTTON_WIDTH) {
    if (Store.addTabButton.left !== "auto") {
      if (animation) {
        animateAddTabButton(containerWidth - TABBAR_BUTTON_WIDTH);
        setTimeout(() => {
          Store.addTabButton.left = "auto";
        }, tabAnimations.left.duration * 1000);
      } else {
        Store.addTabButton.left = "auto";
      }
    }
  } else {
    if (Store.addTabButton.left === "auto") {
      Store.addTabButton.left = containerWidth - TABBAR_BUTTON_WIDTH;
    }

    if (animation) {
      animateAddTabButton(left);
    } else {
      Store.addTabButton.left = left;
    }
  }
};

export const getTabLeft = (tab: ITab): number => {
  const { tabs } = Store.tabGroups[Store.selectedTabGroup];
  const previousTab = tabs[tabs.indexOf(tab) - 1];

  if (previousTab) {
    const { left, width } = previousTab;
    return left + width;
  }

  return 0;
};

export const setTabsWidths = (animation = true) => {
  const { tabs } = Store.tabGroups[Store.selectedTabGroup];
  const newTabs = tabs.filter(tab => !tab.isRemoving);

  widths = [];

  for (const item of newTabs) {
    const width = getTabWidth(item, newTabs.length);

    if (item.width !== width) {
      if (animation) {
        animateTab(item, "width", width);
      } else {
        item.width = width;
      }
    }
    item.newWidth = width;

    widths.push(width);
  }
};

export const getTabWidth = (
  tab: ITab,
  tabsCount = Store.tabGroups[Store.selectedTabGroup].tabs.length
): number => {
  const containerWidth = Store.getTabBarWidth();

  let width = tab.pinned
    ? TAB_PINNED_WIDTH
    : (containerWidth - TABBAR_BUTTON_WIDTH) / tabsCount;

  if (width > TAB_MAX_WIDTH) {
    width = TAB_MAX_WIDTH;
  }

  if (!tab.pinned && width < TAB_MIN_WIDTH) {
    width = TAB_MIN_WIDTH;
  }

  return width;
};

export const getTabById = (id: number): ITab => {
  const { tabGroups } = Store;

  const tabs = tabGroups.map((tabGroup: ITabGroup) => {
    const tab = tabGroup.tabs.filter((item: ITab) => item.id === id)[0];

    if (tab != null) {
      return tab;
    }
  });

  return tabs[0];
};

export const addTab = (): ITab => {
  const index =
    Store.tabGroups[Store.selectedTabGroup].tabs.push({
      id: nextTabId,
      title: "New tab",
      left: 0,
      width: 0,
      pinned: false,
      isRemoving: false,
      newLeft: 0,
      newWidth: 0
    }) - 1;

  const tab = Store.tabGroups[Store.selectedTabGroup].tabs[index];

  selectTab(tab);
  addPage(tab.id);

  nextTabId += 1;

  return tab;
};

export const removeTab = (tab: ITab) => {
  Store.tabGroups[Store.selectedTabGroup].tabs = Store.tabGroups[Store.selectedTabGroup].tabs.filter(
    ({ id }) => tab.id !== id
  );
  Store.pages = Store.pages.filter(({ id }) => tab.id !== id);
};

export const selectTab = (tab: ITab) => {
  Store.tabGroups[Store.selectedTabGroup].selectedTab = tab.id;
};
