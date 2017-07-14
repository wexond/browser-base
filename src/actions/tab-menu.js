import Store from '../store'

export default class TabMenuActions {
  static addNewTab (app) {
    Store.app.elements.tabs.addTab()
  }

  static pinTab (app) {
    Store.hoveredTab.pin()
  }

  static muteTab () {

  }

  static duplicate () {

  }

  static closeTab (app) {
    Store.hoveredTab.close()
  }

  static closeOtherTabs () {

  }

  static closeTabsFromRight () {

  }

  static revertClosedTab () {

  }
}