import Component from 'inferno-component'

import { connect } from 'inferno-mobx'
import { observe } from 'mobx'
import Store from '../../store'

import Tab from '../Tab'
import AddTab from '../AddTab'

import { defaultOptions, transitions } from '../../defaults/tabs'

import { addTab, setPositions, setWidths, getPosition, getWidth } from '../../actions/tabs'

@connect
export default class Tabs extends Component {
  constructor () {
    super()

    this.timer = {
      canReset: false
    }

    this.removedTab = false
  }

  componentDidMount () {
    // Start the timer.
    this.timer.timer = setInterval(() => { // Invoke the function each 3 seconds.
      if (this.timer.canReset && this.timer.time === 3) { // If can calculate widths for all tabs.
        // Calculate widths and positions for all tabs.
        this.updateTabs()

        this.timer.canReset = false
      }
      this.timer.time += 1
    }, 1000)

    observe(Store.tabs, change => {
      if (change.addedCount > 0) {
        const tab = change.added[0]

        tab.left = getPosition(change.index, 1)
        setTimeout(() => {
          tab.animateLeft = true
          this.updateTabs()
        })
      }
    })

    window.addEventListener('resize', (e) => {
      if (!e.isTrusted) return
      if (getWidth(this.getWidth(), this.addTab.getWidth(), 1) < 32) return
      
      this.addTab.setState({animateLeft: false})
      setTimeout(() => this.addTab.setState({animateLeft: true}))

      Store.tabs.forEach(tab => {
        tab.animateLeft = false
        tab.animateWidth = false
        setTimeout(() => {
          tab.animateLeft = true
          tab.animateWidth = true
        })
      })
      this.updateTabs()
    })

    addTab(defaultOptions)
  }

  shouldComponentUpdate () {
    if (this.removedTab) {
      this.removedTab = false
      return false
    }
    return true
  }

  updateTabs () {
    const tabsWidth = this.getWidth()
    const addTabWidth = this.addTab.getWidth()

    setWidths(tabsWidth, addTabWidth, 1)
    setPositions(1)
  }

  getWidth () {
    return this.tabs.offsetWidth
  }

  render () {
    return (
      <div ref={(r) => { this.tabs = r }} className='tabs'>
        {Store.tabs.filter(Boolean).map((item) => {
          return <Tab tabs={this} getTabsWidth={this.getWidth} data={item} key={item.id}></Tab>
        })}
        <AddTab ref={(r) => { this.addTab = r }} />
      </div>
    )
  }
}