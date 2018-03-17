import { TweenLite } from "gsap";

// Constants and defaults
import {
  TAB_MAX_WIDTH,
  TAB_MIN_WIDTH,
  TAB_PINNED_WIDTH,
  TOOLBAR_BUTTON_WIDTH
} from "../constants/design";
import { tabAnimations } from "../defaults/tabs";

// Interfaces
import { IAddTabButton, ITab, ITabGroup } from "../interfaces";

import Store from "../store";

let nextTabId = 0;

export const getScrollingMode = (tabGroup: ITabGroup): boolean => {
  for (const tab of tabGroup.tabs) {
    if (!tab.pinned) {
      const width = getTabWidth(tab);
      return width <= TAB_MIN_WIDTH;
    }
  }
};

export const animateLine = (tabGroup: ITabGroup, tab: ITab) => {
  TweenLite.to(tabGroup, tabAnimations.left.duration, {
    lineWidth: tab.newWidth,
    lineLeft: tab.newLeft,
    ease: tabAnimations.left.easing
  });
};

export const animateTab = (
  tab: ITab,
  property: "width" | "left",
  value: number
) => {
  const { easing, duration } = tabAnimations[property];

  TweenLite.to(tab, duration, {
    [property]: value,
    ease: easing
  });
};

export const animateAddTabButton = (left: number) => {
  const { easing, duration } = tabAnimations.left;

  TweenLite.to(Store.addTabButton, duration, {
    left,
    ease: easing
  });
};

export const updateTabs = (animation = true) => {
  const tabGroup = Store.currentTabGroup;
  const { tabs } = tabGroup;
  const newTabs = tabs.filter(tab => !tab.isRemoving);
  const containerWidth = Store.getTabBarWidth();

  let left = 0;

  for (const item of newTabs) {
    const width = getTabWidth(item, newTabs.length);

    if (item.newWidth !== width) {
      if (animation) {
        animateTab(item, "width", width);
      } else {
        item.width = width;
      }
      item.newWidth = width;
    }

    if (item.newLeft !== left) {
      if (animation) {
        animateTab(item, "left", left);
      } else {
        item.left = left;
      }
      item.newLeft = left;
    }

    left += width;
  }

  if (left >= containerWidth - TOOLBAR_BUTTON_WIDTH) {
    if (Store.addTabButton.left !== "auto") {
      if (animation) {
        animateAddTabButton(containerWidth - TOOLBAR_BUTTON_WIDTH);
        setTimeout(() => {
          Store.addTabButton.left = "auto";
        }, tabAnimations.left.duration * 1000);
      } else {
        Store.addTabButton.left = "auto";
      }
    }
  } else {
    if (Store.addTabButton.left === "auto") {
      Store.addTabButton.left = containerWidth - TOOLBAR_BUTTON_WIDTH;
    }

    if (animation) {
      animateAddTabButton(left);
    } else {
      Store.addTabButton.left = left;
    }
  }
};

export const setTabsPositions = (animation = true) => {
  const tabGroup = Store.currentTabGroup;
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

  if (left >= containerWidth - TOOLBAR_BUTTON_WIDTH) {
    if (Store.addTabButton.left !== "auto") {
      if (animation) {
        animateAddTabButton(containerWidth - TOOLBAR_BUTTON_WIDTH);
        setTimeout(() => {
          Store.addTabButton.left = "auto";
        }, tabAnimations.left.duration * 1000);
      } else {
        Store.addTabButton.left = "auto";
      }
    }
  } else {
    if (Store.addTabButton.left === "auto") {
      Store.addTabButton.left = containerWidth - TOOLBAR_BUTTON_WIDTH;
    }

    if (animation) {
      animateAddTabButton(left);
    } else {
      Store.addTabButton.left = left;
    }
  }
};

export const getTabLeft = (tab: ITab) => {
  const { tabs } = Store.currentTabGroup;

  let position = 0;
  for (let i = 0; i < tabs.indexOf(tab); i++) {
    position += tabs[i].newWidth;
  }
  return position;
};

export const setTabsWidths = (animation = true) => {
  const { tabs } = Store.currentTabGroup;
  const newTabs = tabs.filter(tab => !tab.isRemoving);

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
  }
};

export const getTabWidth = (
  tab: ITab,
  tabsCount = Store.currentTabGroup.tabs.length
): number => {
  const containerWidth = Store.getTabBarWidth();

  let width = tab.pinned
    ? TAB_PINNED_WIDTH
    : (containerWidth - TOOLBAR_BUTTON_WIDTH) / tabsCount;

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
    Store.currentTabGroup.tabs.push({
      id: nextTabId,
      title: "New tab",
      left: 0,
      width: 0,
      pinned: false,
      isRemoving: false,
      newLeft: 0,
      newWidth: 0,
      reorderLocked: false,
      hovered: false,
      page: {
        id: nextTabId,
        url: "https://nersent.tk/Projects/Material-React"
      }
    }) - 1;

  const tab = Store.currentTabGroup.tabs[index];

  selectTab(tab);

  nextTabId += 1;

  return tab;
};

export const replaceTab = (callingTab: ITab, secondTab: ITab) => {
  const { tabs } = Store.currentTabGroup;
  const tabsCopy = tabs.slice();
  const firstIndex = tabsCopy.indexOf(callingTab);
  const secondIndex = tabsCopy.indexOf(secondTab);

  tabsCopy[firstIndex] = secondTab;
  tabsCopy[secondIndex] = callingTab;

  animateTab(tabsCopy[firstIndex], "left", getTabLeft(tabsCopy[secondIndex]));

  tabsCopy[firstIndex].reorderLocked = true;

  setTimeout(() => {
    tabsCopy[firstIndex].reorderLocked = false;
  }, tabAnimations.left.duration * 1000);

  (Store.currentTabGroup.tabs as any).replace(tabsCopy);
};

export const getTabUnderTab = (callingTab: ITab, direction: string) => {
  const { tabs } = Store.currentTabGroup;

  for (const tab of tabs) {
    if (tab !== callingTab && !tab.reorderLocked) {
      if (direction === "left") {
        if (
          tab.left < callingTab.left &&
          callingTab.left <= tab.left + tab.width / 2 &&
          callingTab.left >= tab.left
        ) {
          return tab;
        }
      } else {
        if (
          tab.left > callingTab.left &&
          callingTab.left + callingTab.width >= tab.left + tab.width / 2 &&
          callingTab.left + callingTab.width <= tab.left + tab.width
        ) {
          return tab;
        }
      }
    }
  }
};

export const removeTab = (tab: ITab) => {
  (Store.currentTabGroup.tabs as any).replace(
    Store.currentTabGroup.tabs.filter(
      ({ id }) => tab.id !== id
    )
  );
};

export const selectTab = (tab: ITab) => {
  Store.currentTabGroup.selectedTab = tab.id;
};
