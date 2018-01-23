import Store from '../stores/store'

import { remote } from 'electron'

import tabDefaults from '../defaults/tabs.js'
import * as tabGroupsActions from './tab-groups';

let tabId = 0
let firstTab = true

export const addTab = (data = tabDefaults.defaultOptions) => {
  const {
    select,
    url
  } = data

  const tab = {
    id: tabId,
    select: select,
    url: url,
    width: 0,
    pinned: false,
    left: 0,
    animateLeft: false,
    animateWidth: true,
    title: Store.dictionary.pages.newTab.title,
    favicon: '',
    loading: false,
    render: true,
    closing: false,
    tab: null,
    backgroundColor: '#fff',
    barBorder: true
  }

  const page = {
    url: url,
    id: tabId
  }

  if (firstTab) {
    const process = remote.process
    let file

    if (process.env.NODE_ENV === 'dev') {
      if (process.argv.length >= 3) file = process.argv[2]
    } else if (process.argv.length >= 2) {
      file = process.argv[1]
    }

    if (file != null) {
      const _url = `file:///${file}`

      tab.url = _url
      page.url = _url
    }
  }

  tabGroupsActions.getCurrentTabGroup().tabs.push(tab)
  tabGroupsActions.getCurrentTabGroup().pages.push(page)
  tabId++

  firstTab = false
}

export const getSelectedTab = () => {
  return tabGroupsActions.getCurrentTabGroup().tabs.filter(tab => tab.id === Store.selectedTab)[0]
}

export const getTabById = (id) => {
  for (var i = 0; i < Store.tabGroups.length; i++) {
    const tabGroup = Store.tabGroups[i]
    const tabs = tabGroup.tabs.filter(tab => tab.id === id)
    if (tabs.length > 0) return tabs[0]
  }
  return null
}

export const setWidths = (tabsWidth, addTabWidth, margin = 0) => {
  const width = getWidth(tabsWidth, addTabWidth, margin)
  
  const tabs = tabGroupsActions.getCurrentTabGroup().tabs
  const normalTabs = tabs.filter(tab => !tab.pinned)

  // Apply width for all normal tabs.
  normalTabs.forEach(tab => {
    if (tab.width === width) return
    tab.width = width
  })
}

export const getWidth = (tabsWidth, addTabWidth, margin = 0) => {
  const {
    pinnedTabWidth,
    maxTabWidth
  } = tabDefaults

  const tabs = tabGroupsActions.getCurrentTabGroup().tabs.filter(tab => !tab.closing)
  const normalTabs = tabs.filter(tab => !tab.pinned)

  // Calculate margins between tabs.
  const margins = tabs.length * margin
  // Calculate all pinned tabs width.
  const allPinnedTabsWidth = (tabs.length - normalTabs.length) * pinnedTabWidth
  // Calculate final width per tab.
  let newNormalTabWidth = (tabsWidth - addTabWidth - margins - allPinnedTabsWidth) / (tabs.length - allPinnedTabsWidth)

  if (newNormalTabWidth < 32) newNormalTabWidth = 32

  // Limit width to `maxTabWidth`.
  if (newNormalTabWidth > maxTabWidth) newNormalTabWidth = maxTabWidth

  return newNormalTabWidth
}

export const getPosition = (index, margin = 0) => {
  let position = 0
  for (var i = 0; i < index; i++) {
    position += tabGroupsActions.getCurrentTabGroup().tabs[i].width + margin
  }
  return position
}

export const setPositions = (margin = 0) => {
  let addTabLeft = 0

  let tabs = tabGroupsActions.getCurrentTabGroup().tabs.filter(tab => !tab.closing)

  // Apply lefts for all tabs.
  for (var i = 0; i < tabs.length; i++) {
    const tab = tabs[i]
    const newLeft = i * tab.width + i * margin
    tab.left = newLeft
    addTabLeft = newLeft + tab.width
  }

  // Apply left for add tab button.
  Store.addTabLeft = addTabLeft
}

export const getTabFromMouseX = (callingTab, xPos = null) => {
  const tabs = tabGroupsActions.getCurrentTabGroup().tabs
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i] !== callingTab) {
      if (containsX(tabs[i], xPos)) {
        if (!tabs[i].locked) {
          return tabs[i]
        }
      }
    }
  }
  return null
}

export const containsX = (tabToCheck, xPos) => {
  const rect = {
    left: tabToCheck.left,
    right: tabToCheck.left + tabToCheck.width
  }

  if (xPos >= rect.left && xPos <= rect.right) return true

  return false
}

export const replaceTabs = (firstIndex, secondIndex, changePos = true) => {
  const tabs = tabGroupsActions.getCurrentTabGroup().tabs.slice()

  const tab1 = tabs[firstIndex]
  const tab2 = tabs[secondIndex]

  tabs[secondIndex] = tab1
  tabs[firstIndex] = tab2

  tabGroupsActions.getCurrentTabGroup().tabs.replace(tabs)

  // Change positions of replaced tabs.
  if (changePos) {
    tab2.animateLeft = true
    tab2.left = getPosition(tabGroupsActions.getCurrentTabGroup().tabs.indexOf(tab2), 0)
    tab2.locked = true

    setTimeout(() => {
      tab2.locked = false
    }, tabDefaults.transitions.left.duration * 1000)
  }
}

export const findTabToReplace = (callerTab, cursorX) => {
  const tabs = tabGroupsActions.getCurrentTabGroup().tabs
  const overTab = getTabFromMouseX(callerTab, cursorX)

  if (overTab != null && !overTab.pinned) {
    const indexTab = tabs.indexOf(callerTab)
    const indexOverTab = tabs.indexOf(overTab)

    replaceTabs(indexTab, indexOverTab)
  }
}
