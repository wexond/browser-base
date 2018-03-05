import React from 'react'

import { platform } from 'os'

import { observer } from 'mobx-react'
import { observe } from 'mobx'
import Store from '../../../stores/store'

import Tab from '../Tab'
import AddTab from '../AddTab'
import TabGroup from '../TabGroup'

import wexondUrls from '../../../defaults/wexond-urls'
import tabMenuItems from '../../../defaults/tab-menu-items'

import Colors from '../../../utils/colors'

import * as tabsActions from '../../../actions/tabs'
import * as tabGroupsActions from '../../../actions/tab-groups'

@observer
export default class Tabs extends React.Component {
  constructor () {
    super()

    this.removedTab = false

    // Copy tabs to state.
    this.state = {
      tabs: []
    }

    tabGroupsActions.addTabGroup()
  }

  componentDidMount () {
    // Check for changes in Store.
    observe(Store, change => {
      const tab = tabsActions.getSelectedTab()

      if (change.name === 'selectedTab') {
        // Update some info in bar.
        Store.app.bar.addressBar.setInfo(tab.url)
        Store.app.refreshIconsState()

        Store.backgroundColor = tab.backgroundColor
        Store.foreground = Colors.getForegroundColor(tab.backgroundColor)

        // If the tab is a new tab, just toggle input in bar.
        Store.app.bar.addressBar.setInputToggled(tab.url.startsWith(wexondUrls.newtab))

        tabGroupsActions.getCurrentTabGroup().selectedTab = tab.id

        Store.border = tab.barBorder
      }
    })

    window.addEventListener('mousemove', (e) => {
      e.stopPropagation()
      const {
        mouseClickX,
        left,
        isMouseDown,
        tab
      } = Store.tabDragData

      if (!isMouseDown) { return }

      // Don't move pinned tabs.
      if (tab.pinned) { return }

      const mouseX = (e.clientX + this.tabs.scrollLeft)
      const mouseDeltaX = e.pageX - mouseClickX
      const newX = left + mouseX - mouseClickX

      const tabsLeft = this.tabs.getBoundingClientRect().left

      // If the mouse cursor moved x by 5, 
      // then start dragging the tab.
      if (Math.abs(mouseDeltaX) > 5) {
        // Check if the tab will not go out of tabbar bounds.
        if (!(newX < tabsLeft + this.tabs.scrollLeft) 
            && !(newX + tab.width - this.tabs.scrollLeft > this.tabs.offsetWidth)) {
          tab.left = newX
        }
        tab.animateLeft = false
        tabsActions.findTabToReplace(tab, mouseX)
      }
    })

    window.addEventListener('mouseup', (e) => {
      const {
        isMouseDown,
        tab
      } = Store.tabDragData

      if (!isMouseDown) { return }
      
      tab.animateLeft = true
      Store.tabDragData = {}
      tabsActions.setPositions()
    })
  }

  getWidth () {
    return this.tabs.offsetWidth
  }

  updateTabs () {
    // Get widths.
    const tabsWidth = this.getWidth()
    const addTabWidth = this.addTab.getWidth()

    // Set widths and lefts.
    tabsActions.setWidths(tabsWidth, addTabWidth)
    tabsActions.setPositions()
  }

  render () {
    const tabs = tabGroupsActions.getCurrentTabGroup().tabs.filter(tab => !tab.pinned)

    const tabsStyle = {
      WebkitAppRegion: (tabs[0] != null && tabs[0].width > 32) ? 'drag' : 'no-drag',
      marginLeft: platform() === 'darwin' ? 80 : 0
    }

    const onContextMenu = (e) => {
      const tab = tabsActions.getTabFromMouseX(null, Store.cursor.x)

      let items = tabMenuItems().map((item) => {
        return {
          type: item.type,
          title: item.title,
          onClick: () => item.onClick(tab.tab),
        }
      })

      Store.app.tabMenu.setState({ items: items })

      Store.app.tabMenu.show()

      // Calculate new menu position
      // using cursor x, y and 
      // width, height of the menu.
      let x = Store.cursor.x
      let y = Store.cursor.y

      // By default it opens menu from upper left corner.
      let left = x + 1
      let top = y + 1

      // Open menu from right corner.
      if (left + 300 > window.innerWidth) {
        left = x - 301
      }

      // Open menu from bottom corner.
      if (top + Store.app.tabMenu.newHeight > window.innerHeight) {
        top = y - Store.app.tabMenu.newHeight
      }

      if (top < 0) {
        top = 96
      }

      // Set the new position.
      Store.app.tabMenu.setState({ left: left, top: top })
    }

    return (
      <div ref={(r) => { this.tabs = r }} style={tabsStyle} onContextMenu={onContextMenu} className={'tabs ' + Store.foreground}>
        {Store.tabGroups.map((tabGroup, key) => {
          return <TabGroup id={tabGroup.id} key={tabGroup.id}></TabGroup>
        })}
       
        <AddTab ref={(r) => { this.addTab = r }} />
        
      </div>
    )
  }
}