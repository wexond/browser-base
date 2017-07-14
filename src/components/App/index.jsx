import Colors from '../../utils/colors'
import Store from '../../store'

import Component from '../../component'

import * as pageMenuActions from '../../actions/page-menu'
import * as tabMenuActions from '../../actions/tab-menu'
import * as mainMenuActions from '../../actions/main-menu'

import { getTabFromMousePoint } from '../../actions/tabs'

import { tabMenuItems } from '../../defaults/tab-menu-items'
import { pageMenuItems } from '../../defaults/page-menu-items'
import { mainMenuItems } from '../../defaults/main-menu-items'

import Tabs from '../Tabs'
import Bar from '../Bar'
import Menu from '../Menu'

export default class App extends Component {
  constructor () {
    super()
  }

  beforeRender () {
    Store.app = this

    this.cursor = {}
  }

  render () {
    return (
      <div>
        <Tabs ref='tabs' />
        <Bar ref='bar' />
        <div className='pages' ref='pages' />
        <Menu showNavigationIcons={true} ref='webviewMenu' />
        <Menu showNavigationIcons={true} ref='tabMenu' />
        <Menu ref='mainMenu' />
      </div>
    )
  }

  afterRender () {
    const self = this

    this.elements.tabs.addTab()

    window.addEventListener('mousedown', (e) => {
      self.elements.webviewMenu.hide()
      self.elements.mainMenu.hide()
      self.elements.tabMenu.hide()
    })

    window.addEventListener('mousemove', function (e) {
      Store.cursor.x = e.pageX
      Store.cursor.y = e.pageY
    })

    this.elements.tabs.elements.tabbar.addEventListener('contextmenu', (e) => {
      if (e.target === self.elements.tabs.elements.addButton) return

      Store.hoveredTab = getTabFromMousePoint(null)

      const tabMenu = self.elements.tabMenu

      let newItems = tabMenu.menuItems

      newItems[10].enabled = (self.lastClosedURL !== '' && self.lastClosedURL != null)

      if (Store.hoveredTab.pinned) {
        newItems[2].title = 'Unpin tab'
      } else {
        newItems[2].title = 'Pin tab'
      }

      tabMenu.updateItems(newItems)
      tabMenu.show()

      let left = e.pageX + 1
      let top = e.pageY + 1

      if (left + 300 > window.innerWidth) {
        left = e.pageX - 301
      }
      if (top + tabMenu.height > window.innerHeight) {
        top = e.pageY - tabMenu.height
      }
      if (top < 0) {
        top = 96
      }

      tabMenu.setPosition(left, top)
    })

    // Page menu items actions.
    pageMenuItems[0].onClick = () => pageMenuActions.openLinkInNewTab(this)
    pageMenuItems[2].onClick = () => pageMenuActions.copyLinkAddress()
    pageMenuItems[3].onClick = () => pageMenuActions.saveLinkAs()
    pageMenuItems[5].onClick = () => pageMenuActions.openImageInNewTab(this)
    pageMenuItems[6].onClick = () => pageMenuActions.saveImageAs()
    pageMenuItems[7].onClick = () => pageMenuActions.copyImage()
    pageMenuItems[8].onClick = () => pageMenuActions.copyImageAddress()
    pageMenuItems[10].onClick = () => pageMenuActions.print(this)
    pageMenuItems[11].onClick = () => pageMenuActions.saveAs(this)
    pageMenuItems[13].onClick = () => pageMenuActions.viewSource(this)
    pageMenuItems[14].onClick = () => pageMenuActions.inspectElement(this)

    // Tab menu items.
    tabMenuItems[0].onClick = () => tabMenuActions.addNewTab(this)
    tabMenuItems[2].onClick = () => tabMenuActions.pinTab()
    tabMenuItems[3].onClick = () => tabMenuActions.muteTab()
    tabMenuItems[4].onClick = () => tabMenuActions.duplicate()
    tabMenuItems[6].onClick = () => tabMenuActions.closeTab()
    tabMenuItems[7].onClick = () => tabMenuActions.closeOtherTabs()
    tabMenuItems[8].onClick = () => tabMenuActions.closeTabsFromLeft()
    tabMenuItems[9].onClick = () => tabMenuActions.closeTabsFromRight()
    tabMenuItems[10].onClick = () => tabMenuActions.revertClosedTab()

    // Main menu items.
    mainMenuItems[0].onClick = () => mainMenuActions.newTab(this)
    mainMenuItems[1].onClick = () => mainMenuActions.newIncognitoWindow()
    mainMenuItems[3].onClick = () => mainMenuActions.history()
    mainMenuItems[4].onClick = () => mainMenuActions.bookmarks()
    mainMenuItems[5].onClick = () => mainMenuActions.downloads()
    mainMenuItems[7].onClick = () => mainMenuActions.settings()
    mainMenuItems[8].onClick = () => mainMenuActions.extensions()
    mainMenuItems[9].onClick = () => mainMenuActions.developerTools()

    this.elements.webviewMenu.updateItems(pageMenuItems)
    this.elements.tabMenu.updateItems(tabMenuItems)
    this.elements.mainMenu.updateItems(mainMenuItems)
  }

  getSelectedTab () {
    return this.elements.tabs.selectedTab
  }

  getSelectedPage () {
    return this.getSelectedTab().page
  }

  /**
   * Changes UI colors.
   * @param {String} color - hex color
   * @param {Tab} tab
   */
  changeUIColors (color, tab) {
    tab.colors.select = color

    if (!tab.selected) return

    const bar = this.elements.bar
    const tabs = this.elements.tabs
    const tabDiv = tab.elements.tab
    const white = (Colors.getForegroundColor(color) === 'white')

    const darkerColor = (color !== '#fff') ? Colors.shadeColor(color, -0.1) : '#eee'

    if (white) {
      tabs.elements.tabs.classList.add('tabs-white-foreground')
      bar.elements.bar.classList.add('bar-white-foreground')
      bar.elements.barInfo.elements.barInfo.classList.add('bar-info-white-foreground')
    } else {
      tabs.elements.tabs.classList.remove('tabs-white-foreground')
      bar.elements.bar.classList.remove('bar-white-foreground')
      bar.elements.barInfo.elements.barInfo.classList.remove('bar-info-white-foreground')
    }

    tab.appendTransition('background-color')

    tabDiv.setCSS({
      backgroundColor: color
    })

    tabs.elements.tabs.setCSS({
      backgroundColor: darkerColor
    })

    bar.elements.bar.setCSS({
      backgroundColor: color
    })

    bar.elements.barInfo.elements.input.setCSS({
      backgroundColor: color
    })
  }
}
