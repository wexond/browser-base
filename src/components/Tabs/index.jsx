import Component from 'inferno-component'

import { connect } from 'inferno-mobx'
import { observe } from 'mobx'
import Store from '../../store'

import Tab from '../Tab'
import AddTab from '../AddTab'

import { defaultOptions, transitions } from '../../defaults/tabs'

import { addTab, setPositions, setWidths, getPosition, getWidth, findTabToReplace } from '../../actions/tabs'

@connect
export default class Tabs extends Component {
  constructor () {
    super()

    this.timer = {
      canReset: false
    }

    this.removedTab = false

    // Copy Store.tabs to state.
    this.state = {
      tabs: Store.tabs.slice()
    }
  }

  componentDidMount () {
    // Start the timer.
    setInterval(() => { // Invoke the function each 3 seconds.
      // Set widths and positions for tabs 3 seconds after a tab was closed
      if (this.timer.canReset && this.timer.time === 3) {
        this.updateTabs()
        this.timer.canReset = false
      }
      this.timer.time += 1
    }, 1000)

    observe(Store.tabs, change => {
      if (change.addedCount > 0 && change.removedCount > 0) return
      // If an item was added.
      if (change.addedCount > 0) {
        // Add the item to state.
        this.setState({tabs: change.object.slice()})

        // Get and set initial left for new tab.
        const tab = change.added[0]
        tab.left = getPosition(change.index)

        // Enable left animation.
        setTimeout(() => {
          tab.animateLeft = true
          this.updateTabs()
        })

        return
      }
      // If an item was removed.
      if (change.removedCount > 0) {
        // Remove it from state after delay, to keep close animation.
        setTimeout(() => {
          this.setState({tabs: change.object.slice()})
        }, transitions.width.duration * 1000)
        
        return
      }
    })

    window.addEventListener('resize', (e) => {
      if (!e.isTrusted) return
      
      // Don't resize tabs when they new width is less than 32.
      if (getWidth(this.getWidth(), this.addTab.getWidth()) < 32) return
      
      // Turn off left animation for add tab button.
      this.addTab.setState({animateLeft: false})
      // After a while enable left animation for add tab button.
      setTimeout(() => this.addTab.setState({animateLeft: true}))

      // Disable animations for all tabs.
      Store.tabs.forEach(tab => {
        if (tab == null) return
        tab.animateLeft = false
        tab.animateWidth = false
        // After setting widths and lefts, enable the animations.
        setTimeout(() => {
          if (tab == null) return
          tab.animateLeft = true
          tab.animateWidth = true
        })
      })
      this.updateTabs()
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

      const mouseDeltaX = e.pageX - mouseClickX
      const newX = left + e.clientX - mouseClickX

      if (Math.abs(mouseDeltaX) > 5) {
        if (!(newX < this.tabs.getBoundingClientRect().left) && !(newX + tab.width > this.tabs.offsetWidth)) {
          tab.left = newX
        }
        tab.animateLeft = false
        findTabToReplace(tab, e.clientX)
      }
    })

    window.addEventListener('mouseup', (e) => {
      const {
        isMouseDown,
        tab
      } = Store.tabDragData
      if (!isMouseDown) return
      tab.animateLeft = true
      Store.tabDragData.isMouseDown = false
      this.updateTabs()
    })

    addTab(defaultOptions)
  }

  resetTimer () {
    this.timer.canReset = true
    this.timer.time = 0
  }

  updateTabs () {
    // Get widths.
    const tabsWidth = this.getWidth()
    const addTabWidth = this.addTab.getWidth()

    // Set widths and lefts.
    setWidths(tabsWidth, addTabWidth)
    setPositions()
  }

  getWidth () {
    return this.tabs.offsetWidth
  }

  render () {
    return (
      <div ref={(r) => { this.tabs = r }} className='tabs'>
        {this.state.tabs.map((item) => {
          return <Tab tabs={this} getTabsWidth={this.getWidth} tab={item} key={item.id}></Tab>
        })}
        <AddTab ref={(r) => { this.addTab = r }} />
      </div>
    )
  }
}