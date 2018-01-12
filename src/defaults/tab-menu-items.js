import * as tabMenuActions from "../actions/tab-menu";

export default [
  {
    title: 'Add new tab',
    onClick: tabMenuActions.addNewTab
  },
  {
    type: 'separator'
  },
  {
    title: 'Pin tab',
    onClick: tabMenuActions.pinTab
  },
  {
    title: 'Mute tab',
    onClick: tabMenuActions.muteTab
  },
  {
    title: 'Duplicate',
    onClick: tabMenuActions.duplicate
  },
  {
    type: 'separator'
  },
  {
    title: 'Close tab',
    onClick: tabMenuActions.closeTab
  },
  {
    title: 'Close other tabs',
    onClick: tabMenuActions.closeOtherTabs
  },
  {
    title: 'Close tabs from left',
    onClick: tabMenuActions.closeTabsFromLeft
  },
  {
    title: 'Close tabs from right',
    onClick: tabMenuActions.closeTabsFromRight
  },
  {
    title: 'Revert closed tab',
    enabled: false,
    onClick: tabMenuActions.revertClosedTab
  }
]