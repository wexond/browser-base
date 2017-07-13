import Store from '../store'

/**
 * Gets tab from mouse x and y point.
 * @param {Tab} callingTab
 * @param {Number} cursorX
 * @param {Number} cursorY
 * @return {Tab}
 */
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

/**
 * Checks if {Tab} contains mouse x and y position.
 * @param {Tab} tabToCheck
 * @param {Number} xPos
 * @param {Number} yPos
 * @return {Boolean}
 */
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

/**
 * Replaces tabs.
 * @param {Number} firstIndex
 * @param {Number} secondIndex
 * @param {Boolean} changePos
 */
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

/**
 * Updates tabs borders.
 */
export const updateTabs = () => Store.tabs.forEach((tab) => tab.updateBorders())

/**
 * Gets selected tab.
 * @return {Tab}
 */
export const getSelectedTab = () => {
  for (var i = 0; i < Store.tabs.length; i++) {
    if (tab.selected) return tab
  }
}

/**
 * Checks if mouse x position is on any tab.
 * If it is, then replaces caller tab with second tab.
 * @param {Tab} callerTab
 * @param {Number} cursorX
 */
export const findTabToReplace = (callerTab, cursorX) => {
  const overTab = getTabFromMousePoint(callerTab, cursorX)

  if (overTab != null && !overTab.pinned) {
    const indexTab = Store.tabs.indexOf(callerTab)
    const indexOverTab = Store.tabs.indexOf(overTab)

    replaceTabs(indexTab, indexOverTab)
  }
}