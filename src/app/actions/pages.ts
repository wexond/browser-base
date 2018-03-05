import Store from '../store'
import * as tabGroupsActions from './tab-groups'
import Page from '../components/Page';

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
  return tabGroupsActions.getCurrentTabGroup().pages.filter((page: Page) => page.id === Store.selectedTab)[0]
}
