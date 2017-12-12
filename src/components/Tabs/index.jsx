import Component from 'inferno-component'

import { connect } from 'inferno-mobx'
import { observe } from 'mobx'
import Store from '../../store'

import Tab from '../Tab'
import AddTab from '../AddTab'
import TabGroup from '../TabGroup'

import wexondUrls from '../../defaults/wexond-urls'

import Colors from '../../utils/colors'

import { setPositions, setWidths, findTabToReplace, getSelectedTab, addTabGroup, getCurrentTabGroup } from '../../actions/tabs'

@connect
export default class Tabs extends Component {
  constructor () {
    super()

    this.removedTab = false

    // Copy tabs to state.
    this.state = {
      tabs: []
    }

    addTabGroup()
  }

  componentDidMount () {
    // Check for changes in Store.
    observe(Store, change => {
      const tab = getSelectedTab()

      if (change.name === 'selectedTab') {
        // Update some info in bar.
        Store.app.bar.addressBar.setInfo(tab.url)
        Store.app.refreshIconsState()

        Store.backgroundColor = tab.backgroundColor
        Store.foreground = Colors.getForegroundColor(tab.backgroundColor)

        // If the tab is a new tab, just toggle input in bar.
        Store.app.bar.addressBar.setInputToggled(tab.url.startsWith(wexondUrls.newtab))

        getCurrentTabGroup().selectedTab = tab.id
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

      if (!isMouseDown) return

      // Don't move pinned tabs.
      if (tab.pinned) return

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
        findTabToReplace(tab, mouseX)
      }
    })

    window.addEventListener('mouseup', (e) => {
      const {
        isMouseDown,
        tab
      } = Store.tabDragData

      if (!isMouseDown) return
      
      tab.animateLeft = true
      Store.tabDragData = {}
      setPositions()
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
    setWidths(tabsWidth, addTabWidth)
    setPositions()

    setTimeout(() => {
      this.addTab.setState({animateLeft: true})
    })
  }

  render () {
    const tabs = getCurrentTabGroup().tabs.filter(tab => !tab.pinned)

    const tabsStyle = {
      '-webkit-app-region': (tabs[0] != null && tabs[0].width > 32) ? 'drag' : 'no-drag'
    }

    const onGroupsClick = (e) => {
      Store.app.dialog.show()
    }

    return (
      <div ref={(r) => { this.tabs = r }} style={tabsStyle} className={'tabs ' + Store.foreground}>
        {Store.tabGroups.map((tabGroup, key) => {
          return <TabGroup id={tabGroup.id} key={tabGroup.id}></TabGroup>
        })}
       
        <AddTab ref={(r) => { this.addTab = r }} />
        <div onClick={onGroupsClick} className='groups'></div>
      </div>
    )
  }
}