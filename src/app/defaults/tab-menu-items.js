import * as tabMenuActions from "../actions/tab-menu"

import Store from '../stores/store'

export default () => {
  const {
    addNewTab,
    pinTab,
    muteTab,
    duplicate,
    closeTab,
    closeOtherTabs,
    closeTabsFromLeft,
    closeTabsFromRight,
    revertClosedTab
  } = Store.dictionary.menu.tab

  return [
    {
      title: addNewTab,
      onClick: tabMenuActions.addNewTab
    },
    {
      type: 'separator'
    },
    {
      title: pinTab,
      onClick: tabMenuActions.pinTab
    },
    {
      title: muteTab,
      onClick: tabMenuActions.muteTab
    },
    {
      title: duplicate,
      onClick: tabMenuActions.duplicate
    },
    {
      type: 'separator'
    },
    {
      title: closeTab,
      onClick: tabMenuActions.closeTab
    },
    {
      title: closeOtherTabs,
      onClick: tabMenuActions.closeOtherTabs
    },
    {
      title: closeTabsFromLeft,
      onClick: tabMenuActions.closeTabsFromLeft
    },
    {
      title: closeTabsFromRight,
      onClick: tabMenuActions.closeTabsFromRight
    },
    {
      title: revertClosedTab,
      enabled: false,
      onClick: tabMenuActions.revertClosedTab
    }
  ]
}