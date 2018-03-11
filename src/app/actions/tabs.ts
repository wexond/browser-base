import Store from "../store";

import { tabTransitions } from "../defaults/tabs";

import {
  SYSTEM_BAR_HEIGHT,
  TAB_MAX_WIDTH,
  TAB_MIN_WIDTH,
  TAB_PINNED_WIDTH
} from "../constants/design";

import { ITab, ITabGroup } from "../interfaces";

import { addPage } from "./pages";

let nextTabId = 0;

export const setTabAnimation = (
  tab: ITab,
  property: "left" | "width",
  flag: boolean
) => {
  if (flag) {
    if (
      !(tab.transitions.filter(item => item.property === property).length > 0)
    ) {
      tab.transitions.push({
        property,
        ...tabTransitions.left
      });
    }
  } else {
    tab.transitions = tab.transitions.filter(
      item => item.property !== property
    );
  }
};

export const getScrollingMode = (tabGroup: ITabGroup): boolean => {
  for (const tab of tabGroup.tabs) {
    if (!tab.pinned) {
      const width = getTabWidth(tab);
      tabGroup.scrollingMode = width <= TAB_MIN_WIDTH;
      return width <= TAB_MIN_WIDTH;
    }
  }
};

export const setTabsPositions = (
  animation = true,
  addTabButtonAnimation = true
) => {
  const tabGroup = Store.tabGroups[0];
  const { tabs } = tabGroup;
  const containerWidth = Store.getTabBarWidth();

  let left = 0;

  Store.addTabButton.leftAnimation = addTabButtonAnimation;

  requestAnimationFrame(() => {
    for (const item of tabs) {
      if (item.left !== left) {
        setTabAnimation(item, "left", animation);
        item.left = left;
      }
      left += item.width;
    }
    if (left >= containerWidth - SYSTEM_BAR_HEIGHT) {
      if (Store.addTabButton.left !== "auto") {
        Store.addTabButton.left = containerWidth - SYSTEM_BAR_HEIGHT;

        setTimeout(() => {
          Store.addTabButton.left = "auto";
        }, tabTransitions.left.duration * 1000);
      }

      if (!tabGroup.scrollingMode) {
        tabGroup.scrollingMode = true;
      }
    } else {
      if (Store.addTabButton.left === "auto") {
        Store.addTabButton.left = containerWidth - SYSTEM_BAR_HEIGHT;

        requestAnimationFrame(() => {
          Store.addTabButton.left = left;
        });
      } else {
        Store.addTabButton.left = left;
      }

      if (tabGroup.scrollingMode) {
        tabGroup.scrollingMode = false;
      }
    }
  });
};

export const getTabLeft = (tab: ITab): number => {
  const { tabs } = Store.tabGroups[0];
  const previousTab = tabs[tabs.indexOf(tab) - 1];

  if (previousTab) {
    const { left, width } = previousTab;
    return left + width;
  }

  return 0;
};

export const setTabsWidths = (animation = true) => {
  const { tabs } = Store.tabGroups[0];
  const containerWidth = Store.getTabBarWidth();

  const newTabs = tabs.filter(tab => !tab.isRemoving);

  requestAnimationFrame(() => {
    for (const item of newTabs) {
      const width = getTabWidth(item, newTabs.length);

      if (item.width !== width) {
        setTabAnimation(item, "width", animation);
        item.width = width;
      }
    }
  });
};

export const getTabWidth = (
  tab: ITab,
  tabsCount = Store.tabGroups[0].tabs.length
): number => {
  const containerWidth = Store.getTabBarWidth();

  let width = tab.pinned
    ? TAB_PINNED_WIDTH
    : (containerWidth - SYSTEM_BAR_HEIGHT) / tabsCount;

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
    Store.tabGroups[0].tabs.push({
      id: nextTabId,
      title: "New tab",
      left: 0,
      width: 0,
      pinned: false,
      isRemoving: false,
      transitions: [
        {
          property: "background-color",
          ...tabTransitions["background-color"]
        }
      ]
    }) - 1;

  const tab = Store.tabGroups[0].tabs[index];

  selectTab(tab);
  addPage(tab.id);

  nextTabId += 1;

  return tab;
};

export const removeTab = (tab: ITab) => {
  Store.tabGroups[0].tabs = Store.tabGroups[0].tabs.filter(
    ({ id }) => tab.id !== id
  );
  Store.pages = Store.pages.filter(({ id }) => tab.id !== id);
};

export const selectTab = (tab: ITab) => {
  Store.tabGroups[0].selectedTab = tab.id;
};
