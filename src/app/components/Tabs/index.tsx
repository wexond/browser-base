import React from 'react'

import { platform } from 'os'

import { observe } from 'mobx'
import { observer } from 'mobx-react'
import Store from '../../store'

import AddTab from '../AddTab'
import Tab from '../Tab'
import TabGroup from '../TabGroup'

import tabMenuItems from '../../defaults/tab-menu-items'
import wexondUrls from '../../defaults/wexond-urls'

import Colors from '../../utils/colors'

import * as tabGroupsActions from '../../actions/tab-groups'
import * as tabsActions from '../../actions/tabs'

interface Props {

}

interface State {

}

@observer
export default class Tabs extends React.Component<Props, State> {
  
  public removedTab: boolean
  public tabs: HTMLDivElement
  public addTab: AddTab
  constructor(props: Props) {
    super(props)

    this.removedTab = false

    // Copy tabs to state.
    this.state = {
      tabs: []
    }

    tabGroupsActions.addTabGroup()
  }

  public componentDidMount () {
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

  public getWidth () {
    return this.tabs.offsetWidth
  }

  public updateTabs () {
    // Get widths.
    const tabsWidth = this.getWidth()
    const addTabWidth = this.addTab.getWidth()

    // Set widths and lefts.
    tabsActions.setWidths(tabsWidth, addTabWidth)
    tabsActions.setPositions()
  }

  public render (): JSX.Element {
    const tabs = tabGroupsActions.getCurrentTabGroup().tabs.filter((tab: Tab) => !tab.pinned)

    const tabsStyle = {
      WebkitAppRegion: (tabs[0] != null && tabs[0].width > 32) ? 'drag' : 'no-drag',
      marginLeft: platform() === 'darwin' ? 80 : 0
    }

    const onContextMenu = (e: any) => {
      const tab = tabsActions.getTabFromMouseX(null, Store.cursor.x)

      const items = tabMenuItems().map((item) => {
        return {
          type: item.type,
          title: item.title,
          onClick: () => item.onClick(tab.tab),
        }
      })

      Store.app.tabMenu.setState({ items })

      Store.app.tabMenu.show()

      // Calculate new menu position
      // using cursor x, y and 
      // width, height of the menu.
      const x = Store.cursor.x
      const y = Store.cursor.y

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
      Store.app.tabMenu.setState({ left, top })
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