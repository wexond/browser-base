import Store from '../stores/store'
import * as tabGroupsActions from './tab-groups'

export const getNavigationState = () => {
  const page = getSelectedPage()
  
  if (page != null && page.page != null && page.page.webview.getWebContents() != null) {
    return {
      canGoBack: page.page.webview.canGoBack(),
      canGoForward: page.page.webview.canGoForward()
    }
  }
}

export const getSelectedPage = () => {
  return tabGroupsActions.getCurrentTabGroup().pages.filter(page => page.id === Store.selectedTab)[0]
}
