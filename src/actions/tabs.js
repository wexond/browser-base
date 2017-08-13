import Store from '../store'

import { tabDefaults } from '../defaults/tabs.js'

export const addTab = data => {
  const {
    select,
    url
  } = data

  const tab = {
    id: Store.tabs.length,
    select: select,
    url: url,
    width: 0,
    pinned: false,
    left: 0,
    animateLeft: false,
    animateWidth: true
  }

  Store.tabs.push(tab)
}

export const setWidths = (tabsWidth, addTabWidth, margin = 0) => {
  const {
    pinnedTabWidth,
    maxTabWidth
  } = tabDefaults

  const pinnedTabs = Store.tabs.filter(tab => tab.pinned)
  const normalTabs = Store.tabs.filter(tab => !tab.pinned)
  // Calculate margins between tabs.
  const margins = Store.tabs.length * margin
  // Calculate all pinned tabs width.
  const allPinnedTabsWidth = pinnedTabs.length * pinnedTabWidth
  // Calculate final width per tab.
  let newNormalTabWidth = (tabsWidth - addTabWidth - margins - allPinnedTabsWidth) / (Store.tabs.length - allPinnedTabsWidth)

  // Limit width to `maxTabWidth`.
  if (newNormalTabWidth > maxTabWidth) newNormalTabWidth = maxTabWidth

  // Apply width for all normal tabs.
  normalTabs.forEach(tab => {
    tab.width = newNormalTabWidth
  })
}

export const getPosition = (index, margin = 0) => {
  let position = 0
  for (var i = 0; i < Store.tabs.length; i++) {
    if (i === index) {
      return position
    }
    position += Store.tabs[i].width + margin
  }
}

export const setPositions = (margin = 0) => {
  let addTabLeft = 0
  // Apply lefts for all tabs.
  Store.tabs.forEach((tab, index) => {
    const newLeft = index * tab.width + index * margin
    tab.left = newLeft
    addTabLeft = newLeft + tab.width
  })

  // Apply left for add tab button.
  Store.addTabLeft = addTabLeft
}

export const getTabFromMousePoint = (callingTab, xPos = null, yPos = null) => {
  if (xPos == null) {
    xPos = Store.cursor.x
    yPos = Store.cursor.y
  } 

  for (var i = 0; i < Store.tabs.length; i++) {
    if (Store.tabs[i] !== callingTab) {
      if (containsPoint(Store.tabs[i], xPos, yPos)) {
        if (!Store.tabs[i].locked) {
          return Store.tabs[i]
        }
      }
    }
  }
  return null
}

export const containsPoint = (tabToCheck, xPos, yPos = null) => {
  const rect = tabToCheck.elements.tab.getBoundingClientRect()

  if (xPos >= rect.left && xPos <= rect.right) {
    if (yPos != null) {
      if (yPos <= rect.bottom && yPos >= rect.top) return true
      else return false
    } else {
      return true
    }
  }

  return false
}

export const replaceTabs = (firstIndex, secondIndex, changePos = true) => {
  const firstTab = Store.tabs[firstIndex]
  const secondTab = Store.tabs[secondIndex]

  // Replace tabs in array.
  Store.tabs[firstIndex] = secondTab
  Store.tabs[secondIndex] = firstTab

  // Change positions of replaced tabs.
  if (changePos) {
    secondTab.updatePosition()
  }
}

export const updateTabs = () => Store.tabs.forEach((tab) => tab.updateBorders())

export const getSelectedTab = () => {
  for (var i = 0; i < Store.tabs.length; i++) {
    if (tab.selected) return tab
  }
}

export const findTabToReplace = (callerTab, cursorX) => {
  const overTab = getTabFromMousePoint(callerTab, cursorX)

  if (overTab != null && !overTab.pinned) {
    const indexTab = Store.tabs.indexOf(callerTab)
    const indexOverTab = Store.tabs.indexOf(overTab)

    replaceTabs(indexTab, indexOverTab)
  }
}
