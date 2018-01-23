import * as mainMenuActions from '../actions/main-menu'

import Store from '../stores/store'
import LanguageHelper from '../utils/language'

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
      title: LanguageHelper.capFirst(newWindow),
      onClick: mainMenuActions.newWindow
    },
    {
      title: LanguageHelper.capFirst(newIncognitoWindow)
    },
    {
      type: 'separator'
    },
    {
      title: LanguageHelper.capFirst(history),
      onClick: mainMenuActions.history
    },
    {
      title: LanguageHelper.capFirst(bookmarks)
    },
    {
      title: LanguageHelper.capFirst(downloads)
    },
    {
      type: 'separator'
    },
    {
      title: LanguageHelper.capFirst(settings),
      onClick: mainMenuActions.settings
    },
    {
      title: LanguageHelper.capFirst(extensions)
    },
    {
      title: LanguageHelper.capFirst(privacy)
    },
    {
      type: 'separator'
    },
    {
      title: LanguageHelper.capFirst(developerTools),
      onClick: mainMenuActions.developerTools
    }
  ]  
}