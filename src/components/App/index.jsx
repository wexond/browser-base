import Colors from '../../utils/colors'
import Store from '../../store'

import Component from '../../component'

import PageMenuActions from '../../actions/page-menu'
import TabMenuActions from '../../actions/tab-menu'

import { tabMenuItems } from '../../defaults/tab-menu-items'
import { pageMenuItems } from '../../defaults/page-menu-items'

import Tabs from '../Tabs'
import Bar from '../Bar'
import Menu from '../Menu'

export default class App extends Component {
  constructor () {
    super()
  }

  beforeRender () {
    window.app = this

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
        <Menu ref='menu' />
      </div>
    )
  }

  afterRender () {
    const self = this
    this.elements.tabs.addTab()

    window.addEventListener('mousedown', (e) => {
      self.elements.webviewMenu.hide()
      self.elements.menu.hide()
      self.elements.tabMenu.hide()
    })

    this.elements.tabs.elements.tabbar.addEventListener('contextmenu', (e) => {
      if (e.target === self.elements.tabs.elements.addButton) return

      Store.hoveredTab = self.elements.tabs.getTabFromMousePoint(null, e.pageX, e.pageY)

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
    pageMenuItems[0].onClick = () => PageMenuActions.openLinkInNewTab(this)
    pageMenuItems[2].onClick = () => PageMenuActions.copyLinkAddress()
    pageMenuItems[3].onClick = () => PageMenuActions.saveLinkAs()
    pageMenuItems[5].onClick = () => PageMenuActions.openImageInNewTab()
    pageMenuItems[6].onClick = () => PageMenuActions.saveImageAs()
    pageMenuItems[7].onClick = () => PageMenuActions.copyImage()
    pageMenuItems[8].onClick = () => PageMenuActions.copyImageAddress()
    pageMenuItems[10].onClick = () => PageMenuActions.print(this)
    pageMenuItems[11].onClick = () => PageMenuActions.saveAs(this)
    pageMenuItems[13].onClick = () => PageMenuActions.viewSource(this)
    pageMenuItems[14].onClick = () => PageMenuActions.inspectElement(this)

    // Tab menu items.
    tabMenuItems[0].onClick = () => TabMenuActions.addNewTab()
    tabMenuItems[2].onClick = () => TabMenuActions.pinTab()
    tabMenuItems[3].onClick = () => TabMenuActions.muteTab()
    tabMenuItems[4].onClick = () => TabMenuActions.duplicate()
    tabMenuItems[6].onClick = () => TabMenuActions.closeTab()
    tabMenuItems[7].onClick = () => TabMenuActions.closeOtherTabs()
    tabMenuItems[8].onClick = () => TabMenuActions.closeTabsFromLeft()
    tabMenuItems[9].onClick = () => TabMenuActions.closeTabsFromRight()
    tabMenuItems[10].onClick = () => TabMenuActions.revertClosedTab()

    this.elements.webviewMenu.updateItems(pageMenuItems)
    this.elements.tabMenu.updateItems(tabMenuItems)

    this.elements.menu.updateItems(
      [
        {
          title: 'New tab',
          onClick: function () {
            self.elements.tabs.addTab()
          }
        },
        {
          title: 'New incognito window'
        },
        {
          title: 'Separator'
        },
        {
          title: 'History'
        },
        {
          title: 'Bookmarks'
        },
        {
          title: 'Downloads'
        },
        {
          title: 'Separator'
        },
        {
          title: 'Settings'
        },
        {
          title: 'Extensions'
        },
        {
          title: 'Developer tools'
        }
      ]
    )
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
    } else {
      tabs.elements.tabs.classList.remove('tabs-white-foreground')

      bar.elements.bar.classList.remove('bar-white-foreground')
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

    bar.elements.input.setCSS({
      backgroundColor: color
    })
  }
}
