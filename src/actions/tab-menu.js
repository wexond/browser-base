import Store from '../store'

export const addNewTab = (app) => {
  Store.app.elements.tabs.addTab()
}

export const pinTab = () => {
  Store.hoveredTab.pin()
}

export const muteTab = () => {

}

export const duplicate = () => {

}

export const closeTab = () => {
  Store.hoveredTab.close()
}

export const closeOtherTabs = () => {

}

export const closeTabsFromLeft = () => {

}

export const closeTabsFromRight = () => {

}

export const revertClosedTab = () => {

}
