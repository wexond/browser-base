import * as tabsActions from './tabs'
import * as pagesActions from './pages'
import { ipcRenderer } from 'electron'

export const newWindow = (): void => {
  ipcRenderer.send("newWindow")
}

export const newIncognitoWindow = (): void => {

}

export const history = (): void => {
  tabsActions.addTab({
    select: true,
    url: 'wexond://history'
  })
}

export const bookmarks = (): void => {

}

export const downloads = (): void => {

}

export const settings = (): void => {
  tabsActions.addTab({
    select: true,
    url: 'wexond://settings'
  })
}

export const extensions = (): void => {

}

export const developerTools = (): void => {
  pagesActions.getSelectedPage().page.webview.openDevTools()
}