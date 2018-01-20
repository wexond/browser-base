import * as tabsActions from './tabs'
import * as pagesActions from './pages'

export const newWindow = () => {
  
}

export const newIncognitoWindow = () => {

}

export const history = () => {
  tabsActions.addTab({
    select: true,
    url: 'wexond://history'
  })
}

export const bookmarks = () => {

}

export const downloads = () => {

}

export const settings = () => {
  tabsActions.addTab({
    select: true,
    url: 'wexond://settings'
  })
}

export const extensions = () => {

}

export const developerTools = () => {
  pagesActions.getSelectedPage().page.webview.openDevTools()
}