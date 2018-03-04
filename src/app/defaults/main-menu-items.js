import * as mainMenuActions from '../actions/main-menu'

import Store from '../stores/store'

export default () => {
  const {
    newWindow,
    newIncognitoWindow,
    history,
    bookmarks,
    downloads,
    settings,
    extensions,
    privacy,
    developerTools
  } = Store.dictionary.menu.main

  return [
    {
      title: newWindow,
      onClick: mainMenuActions.newWindow
    },
    {
      title: newIncognitoWindow
    },
    {
      type: 'separator'
    },
    {
      title: history,
      onClick: mainMenuActions.history
    },
    {
      title: bookmarks
    },
    {
      title: downloads
    },
    {
      type: 'separator'
    },
    {
      title: settings,
      onClick: mainMenuActions.settings
    },
    {
      title: extensions
    },
    {
      title: privacy
    },
    {
      type: 'separator'
    },
    {
      title: developerTools,
      onClick: mainMenuActions.developerTools
    }
  ]  
}