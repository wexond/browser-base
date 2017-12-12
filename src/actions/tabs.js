import Store from '../store'

import { tabDefaults, transitions } from '../defaults/tabs.js'

let tabId = 0
let groupId = 0

export const switchTabGroup = (id) => {
  if (id === Store.currentTabGroup) return

  Store.currentTabGroup = id

  if (getCurrentTabGroup() != null) {
    Store.selectedTab = getCurrentTabGroup().selectedTab
  }
  
  Store.app.tabs.addTab.setState({animateLeft: false})
  Store.app.tabs.updateTabs()
}

export const addTabGroup = () => {
  Store.tabGroups.push({
    title: 'New group', 
    tabs: [],
    id: groupId
  })
  groupId++
}

export const addTab = data => {
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
    title: 'New tab',
    favicon: '',
    loading: false,
    render: true,
    closing: false,
    tab: null,
    backgroundColor: '#fff'
  }

  const page = {
    url: url,
    id: tabId
  }

  getCurrentTabGroup().tabs.push(tab)
  Store.pages.push(page)
  tabId++
}

export const getSelectedTab = () => {
  return getCurrentTabGroup().tabs.filter(tab => tab.id === Store.selectedTab)[0]
}

export const getCurrentTabGroup = () => {
  return Store.tabGroups.filter((tabGroup) => {
    return tabGroup.id === Store.currentTabGroup
  })[0]
}

export const setWidths = (tabsWidth, addTabWidth, margin = 0) => {
  const width = getWidth(tabsWidth, addTabWidth, margin)
  
  const tabs = getCurrentTabGroup().tabs.filter(Boolean)
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

  const tabs = getCurrentTabGroup().tabs.filter(tab => !tab.closing)
  const normalTabs = tabs.filter(tab => !tab.pinned)

  // Calculate margins between tabs.
  const margins = tabs.length * margin
  // Calculate all pinned tabs width.
  const allPinnedTabsWidth = (tabs.length - normalTabs.length) * pinnedTabWidth
  // Calculate final width per tab.
  let newNormalTabWidth = (tabsWidth - 32 - addTabWidth - margins - allPinnedTabsWidth) / (tabs.length - allPinnedTabsWidth)

  if (newNormalTabWidth < 32) newNormalTabWidth = 32

  // Limit width to `maxTabWidth`.
  if (newNormalTabWidth > maxTabWidth) newNormalTabWidth = maxTabWidth

  return newNormalTabWidth
}

export const getPosition = (index, margin = 0) => {
  let position = 0
  for (var i = 0; i < index; i++) {
    position += getCurrentTabGroup().tabs[i].width + margin
  }
  return position
}

export const setPositions = (margin = 0) => {
  let addTabLeft = 0

  let tabs = getCurrentTabGroup().tabs.filter(tab => !tab.closing)

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
  for (var i = 0; i < getCurrentTabGroup().tabs.length; i++) {
    if (getCurrentTabGroup().tabs[i] !== callingTab) {
      if (containsX(getCurrentTabGroup().tabs[i], xPos)) {
        if (!getCurrentTabGroup().tabs[i].locked) {
          return getCurrentTabGroup().tabs[i]
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
  const tabs = getCurrentTabGroup().tabs.slice()

  const tab1 = tabs[firstIndex]
  const tab2 = tabs[secondIndex]

  tabs[secondIndex] = tab1
  tabs[firstIndex] = tab2

  getCurrentTabGroup().tabs.replace(tabs)

  // Change positions of replaced tabs.
  if (changePos) {
    tab2.animateLeft = true
    tab2.left = getPosition(getCurrentTabGroup().tabs.indexOf(tab2), 0)
    tab2.locked = true

    setTimeout(() => {
      tab2.locked = false
    }, transitions.left.duration * 1000)
  }
}

export const findTabToReplace = (callerTab, cursorX) => {
  const overTab = getTabFromMouseX(callerTab, cursorX)

  if (overTab != null && !overTab.pinned) {
    const indexTab = getCurrentTabGroup().tabs.indexOf(callerTab)
    const indexOverTab = getCurrentTabGroup().tabs.indexOf(overTab)

    replaceTabs(indexTab, indexOverTab)
  }
}
