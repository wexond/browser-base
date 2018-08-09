import { TweenLite } from 'gsap';
import store from '../renderer/store';

import {
  getCurrentWorkspace,
  getCurrentWorkspaceTabs,
  getWorkspaceById,
} from '.';
import { TOOLBAR_BUTTON_WIDTH } from '../constants';
import { tabAnimations } from '../defaults';
import { Tab } from '../models';
import { createPage } from './pages';

export const getTabbarWidth = (): number => {
  if (!store.tabbarRef) {
    return 0;
  }
  return store.tabbarRef.offsetWidth - TOOLBAR_BUTTON_WIDTH;
};

export const getSelectedTab = () =>
  store.tabs.find(x => x.id === getCurrentWorkspace().selectedTab);

export const getTabWidth = (): number => {
  const workspace = getCurrentWorkspace();
  const tabs = store.tabs.filter(
    x => x.workspaceId === workspace.id && !x.isClosing,
  );
  const width = getTabbarWidth() / tabs.length;

  if (width > 200) {
    return 200;
  }
  if (width < 72) {
    return 72;
  }

  return width;
};

export const getTabLeft = (tab: Tab): number => {
  const tabs = getCurrentWorkspaceTabs();
  const index = tabs.indexOf(tab);

  let left = 0;
  for (let i = 0; i < index; i++) {
    left += tabs[i].width;
  }

  return left;
};

export const getTabNewLeft = (tab: Tab): number => {
  const index = getCurrentWorkspaceTabs().indexOf(tab);

  let left = 0;
  for (let i = 0; i < index; i++) {
    left += getTabWidth();
  }

  return left;
};

export const setLeft = (
  ref: HTMLDivElement,
  left: number,
  animation: boolean,
) => {
  if (ref) {
    TweenLite.to(ref, animation ? tabAnimations.left.duration : 0, {
      x: left,
      ease: animation ? tabAnimations.left.easing : null,
    });
  }
};

export const setWidth = (
  ref: HTMLDivElement,
  width: number,
  animation: boolean,
) => {
  if (ref) {
    TweenLite.to(ref, animation ? tabAnimations.width.duration : 0, {
      width,
      ease: animation ? tabAnimations.width.easing : null,
    });
  }
};

export const moveIndicatorToTab = (tab: Tab, animation: boolean) => {
  setLeft(store.tabIndicatorRef, tab.left, animation);
  setWidth(store.tabIndicatorRef, tab.width, animation);
};

export const moveIndicatorToSelectedTab = (animation: boolean) => {
  const tab = getSelectedTab();
  if (tab) {
    moveIndicatorToTab(tab, animation);
  }
};

export const setTabLeft = (tab: Tab, left: number, animation: boolean) => {
  setLeft(tab.ref, left, animation);
  tab.left = left;
};

export const setTabWidth = (tab: Tab, width: number, animation: boolean) => {
  setWidth(tab.ref, width, animation);
  tab.width = width;
};

export const setTabsWidths = (animation: boolean) => {
  const workspace = getCurrentWorkspace();
  const tabs = store.tabs.filter(
    x => x.workspaceId === workspace.id && !x.isClosing,
  );

  for (const tab of tabs) {
    setTabWidth(tab, getTabWidth(), animation);
  }
};

export const setTabsLefts = (animation: boolean) => {
  const workspace = getCurrentWorkspace();
  const tabs = store.tabs.filter(
    x => x.workspaceId === workspace.id && !x.isClosing,
  );

  let left = 0;

  for (const tab of tabs) {
    setTabLeft(tab, left, animation);
    left += tab.width;
  }

  store.addTabLeft = Math.min(left, getTabbarWidth());
  setLeft(store.addTabRef, store.addTabLeft, animation);
};

export const updateTabsBounds = (animation: boolean = true) => {
  setTabsWidths(animation);
  setTabsLefts(animation);
};

export const getTabById = (id: number) => store.tabs.find(x => x.id === id);

export const removeTab = (id: number) => {
  store.tabs = store.tabs.filter(x => x.id !== id);
};

export const replaceTab = (firstTab: Tab, secondTab: Tab) => {
  const { tabs } = store;
  const tabsCopy = tabs.slice();

  const firstIndex = tabsCopy.indexOf(firstTab);
  const secondIndex = tabsCopy.indexOf(secondTab);

  tabsCopy[firstIndex] = secondTab;
  tabsCopy[secondIndex] = firstTab;

  setTabLeft(secondTab, getTabLeft(firstTab), true);
  (tabs as any).replace(tabsCopy);

  return getCurrentWorkspaceTabs();
};

export const getTabsToReplace = (callingTab: Tab, direction: string) => {
  let tabs = getCurrentWorkspaceTabs();
  const index = tabs.indexOf(callingTab);

  if (direction === 'left') {
    for (let i = index; i--;) {
      if (callingTab.left <= tabs[i].width / 2 + tabs[i].left) {
        tabs = replaceTab(tabs[i + 1], tabs[i]);
      }
    }
  } else if (direction === 'right') {
    for (let i = index + 1; i < tabs.length; i++) {
      if (
        callingTab.left + callingTab.width >=
        tabs[i].width / 2 + tabs[i].left
      ) {
        tabs = replaceTab(tabs[i - 1], tabs[i]);
      }
    }
  }
};

export const selectTab = (tab: Tab) => {
  if (!tab.isClosing) {
    const workspace = getWorkspaceById(tab.workspaceId);
    workspace.selectedTab = tab.id;
    moveIndicatorToSelectedTab(true);
  }
};

export const createTab = (
  createProperties: chrome.tabs.CreateProperties = { url: '', active: true },
) => {
  const workspace = getCurrentWorkspace();
  const tab = new Tab(workspace.id);
  store.tabs.push(tab);
  createPage(tab.id, createProperties.url);

  requestAnimationFrame(() => {
    selectTab(tab);
    store.addressBar.toggled = true;
  });

  return tab;
};

export const getIpcTab = (tab: Tab) => {};
