import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import { observe } from 'mobx'
import Store from '../../store'

import Tab from '../Tab'

import { setPositions, setWidths, getPosition, addTab, getWidth } from '../../actions/tabs'

import { defaultOptions, transitions } from '../../defaults/tabs'

@observer
export default class TabGroup extends Component {
  constructor () {
    super()

    this.timer = {
      canReset: false
    }

    this.state = {
      tabs: []
    }
  }

  componentDidMount () {
    this.setState({tabs: Store.tabGroups[this.props.id].slice()})

    // Start the timer.
    setInterval(() => { // Invoke the function each 3 seconds.
      // Set widths and positions for tabs 3 seconds after a tab was closed
      if (this.timer.canReset && this.timer.time === 3) {
        this.updateTabs()
        this.timer.canReset = false
      }
      this.timer.time += 1
    }, 1000)

    // Check for changes in Store.tabsGroups[this.props.id].
    observe(Store.tabGroups[this.props.id], change => {
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

        const interval = setInterval(() => {
          Store.app.tabs.tabs.scrollLeft = Store.app.tabs.tabs.offsetWidth + Store.app.tabs.tabs.scrollLeft
        }, 1)
        
        setTimeout(() => {
          clearInterval(interval)
        }, transitions.width.duration * 1000)

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
      if (getWidth(Store.app.tabs.getWidth(), Store.app.tabs.addTab.getWidth()) < 32) return
      
      // Turn off left animation for add tab button.
      Store.app.tabs.addTab.setState({animateLeft: false})
      // After a while enable left animation for add tab button.
      setTimeout(() => Store.app.tabs.addTab.setState({animateLeft: true}))

      // Disable animations for all tabs.
      Store.tabGroups[this.props.id].forEach(tab => {
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


    addTab(defaultOptions)
  }

  resetTimer () {
    this.timer.canReset = true
    this.timer.time = 0
  }

  updateTabs () {
    // Get widths.
    const tabsWidth = Store.app.tabs.getWidth()
    const addTabWidth = Store.app.tabs.addTab.getWidth()

    // Set widths and lefts.
    setWidths(tabsWidth, addTabWidth)
    setPositions()
  }

  render () {
    return (
      <div className='tab-group' display={(Store.currentTabGroup === this.props.id) ? 'block' : 'none'}>
        {this.state.tabs.map((item) => {
          return <Tab tabs={Store.app.tabs} tabGroup={this} getTabsWidth={Store.app.tabs.getWidth} tab={item} key={item.id}></Tab>
        })}
      </div>
    )
  }
}
