import * as tabsActions from './tabs'

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

}

export const extensions = () => {

}

export const developerTools = () => {
  
}