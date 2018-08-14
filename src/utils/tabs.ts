import { TweenLite } from 'gsap';
import store from '../renderer/store';

import {
  getCurrentWorkspace,
  getCurrentWorkspaceTabs,
  getWorkspaceById,
} from '.';
import { TOOLBAR_BUTTON_WIDTH, TOOLBAR_HEIGHT } from '../constants';
import { tabAnimations } from '../defaults';
import { Tab } from '../models';
import { createPage } from './pages';
import { emitEvent } from './extensions';
import { getWorkspaceTabs } from './workspaces';

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
  const width = getTabbarWidth() / tabs.length - 2;

  if (width > 200 - 2) {
    return 200 - 2;
  }
  if (width < 72 - 2) {
    return 72 - 2;
  }

  return width;
};

export const getTabLeft = (tab: Tab): number => {
  const tabs = getCurrentWorkspaceTabs();
  const index = tabs.indexOf(tab);

  let left = 0;
  for (let i = 0; i < index; i++) {
    left += tabs[i].width + 2;
  }

  return left;
};

export const getTabNewLeft = (tab: Tab): number => {
  const index = getCurrentWorkspaceTabs().indexOf(tab);

  let left = 0;
  for (let i = 0; i < index; i++) {
    left += getTabWidth() + 2;
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
    left += tab.width + 2;
  }

  store.addTabLeft = Math.min(left, getTabbarWidth());
  setLeft(store.addTabRef, store.addTabLeft, animation);
};

export const updateTabsBounds = (animation: boolean = true) => {
  setTabsWidths(animation);
  setTabsLefts(animation);
};

export const getTabById = (id: number) => store.tabs.find(x => x.id === id);

export const removeTab = (id: number) =>
  (store.tabs as any).replace(store.tabs.filter(x => x.id !== id));

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

    emitEvent('tabs', 'onActivated', {
      tabId: tab.id,
      windowId: 0,
    });
  }
};

export const createTab = (
  createProperties: chrome.tabs.CreateProperties = {
    url:
      process.env.ENV === 'dev'
        ? 'http://localhost:8080/newtab.html'
        : 'wexond://newtab',
    active: true,
  },
) => {
  const workspace = getCurrentWorkspace();
  const tab = new Tab(workspace.id);
  store.tabs.push(tab);
  createPage(tab.id, createProperties.url);
  selectTab(tab);

  return tab;
};

export const getIpcTab = (tab: Tab): chrome.tabs.Tab => {
  const tabs = getWorkspaceTabs(tab.workspaceId);
  const selected = getSelectedTab().id === tab.id;

  return {
    id: tab.id,
    index: tabs.indexOf(tab),
    title: tab.title,
    pinned: false,
    favIconUrl: tab.favicon,
    url: tab.url,
    status: tab.loading ? 'loading' : 'complete',
    width: tab.width,
    height: TOOLBAR_HEIGHT,
    active: selected,
    highlighted: selected,
    selected,
    windowId: 0,
    discarded: false,
    incognito: false,
    autoDiscardable: false,
  };
};
