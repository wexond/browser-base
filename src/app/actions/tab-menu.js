import Store from '../stores/store'
import * as tabsActions from './tabs'
import * as pagesActions from './pages'
import * as tabGroupsActions from './tab-groups'

export const addNewTab = () => {
  tabsActions.addTab()
}

export const pinTab = (tab) => {
  tab.pin()
}

export const muteTab = (tab) => {
  let webview = pagesActions.getSelectedPage().page.webview
  webview.setAudioMuted(!webview.isAudioMuted())
}

export const duplicate = (tab) => {
  tabsActions.addTab({
    select: true,
    url: tab.props.tab.url
  })
}

export const closeTab = (tab) => {
  tab.close()
}

export const closeOtherTabs = (tab) => {
  tabGroupsActions.getCurrentTabGroup().tabs.forEach(ttab => {
    if (ttab.id !== tab.props.tab.id) {
      tabsActions.getTabById(ttab.id).tab.close()
    }
  })
}

export const closeTabsFromLeft = (tab) => {
  let tabs = tabGroupsActions.getCurrentTabGroup().tabs
  for (let i = 0; i < tabs.length; i++) {
    let ttab = tabs[0]
    if (ttab.id === tab.props.tab.id) {
      break
    }
    tabsActions.getTabById(ttab.id).tab.close()
  }
}

export const closeTabsFromRight = (tab) => {
  let tabs = tabGroupsActions.getCurrentTabGroup().tabs
  for (let i = tabs.length - 1; i > 0; i--) {
    let ttab = tabs[i]
    if (ttab.id === tab.props.tab.id) {
      break
    }
    tabsActions.getTabById(ttab.id).tab.close()
  }
}

export const revertClosedTab = (tab) => {

}
