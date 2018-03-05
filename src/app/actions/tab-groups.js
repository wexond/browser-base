import Store from '../stores/store'

import * as windowActions from './window'

let groupId = 0

export const addTabGroup = () => {
  Store.tabGroups.push({
    title: Store.dictionary.tabGroups.newGroup, 
    tabs: [],
    pages: [],
    id: groupId
  })
  groupId++
}

export const getCurrentTabGroup = () => {
  return getTabGroupById(Store.currentTabGroup)
}

export const removeTabGroup = (tabGroup) => {
  const tabGroupIndex = Store.tabGroups.indexOf(tabGroup)
  if (Store.tabGroups.length === 1) {
    windowActions.close()
  } else {
    if (tabGroupIndex + 1 < Store.tabGroups.length) {
      switchTabGroup(Store.tabGroups[tabGroupIndex + 1].id) // Select next tab group.
    } else if (Store.tabGroups[tabGroupIndex - 1] != null) {
      switchTabGroup(Store.tabGroups[tabGroupIndex - 1].id) // Select previous tab group.
    }
  }
  Store.tabGroups.splice(tabGroupIndex, 1)
}

export const switchTabGroup = (id) => {
  if (id === Store.currentTabGroup) { return }

  Store.currentTabGroup = id

  if (getCurrentTabGroup() != null) {
    Store.selectedTab = getCurrentTabGroup().selectedTab
  }
  
  Store.app.tabs.addTab.setState({animateLeft: false})
  Store.app.tabs.updateTabs()
}

export const getTabGroupById = (id) => {
  return Store.tabGroups.filter((tabGroup) => {
    return tabGroup.id === id
  })[0]
}