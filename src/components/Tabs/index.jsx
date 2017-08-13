import Component from 'inferno-component'

import { connect } from 'inferno-mobx'
import { observe } from 'mobx'
import Store from '../../store'

import Tab from '../Tab'
import AddTab from '../AddTab'

import { defaultOptions } from '../../defaults/tabs'

import { addTab, setPositions, setWidths, getPosition } from '../../actions/tabs'

@connect
export default class Tabs extends Component {
  componentDidMount () {
    observe(Store.tabs, change => {
      if (change.addedCount > 0) {
        change.added.forEach(tab => {
          tab.left = getPosition(tab.id, 1)
        })
      }
      setTimeout(() => {
        change.added.forEach(tab => {
          tab.animateLeft = true
        })
        this.updateTabs()
      })
    })

    window.addEventListener('resize', (e) => {
      if (!e.isTrusted) return
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
    const tabs = Store.tabs.filter(Boolean).slice()

    return (
      <div ref={(r) => { this.tabs = r }} className='tabs'>
        {tabs.map((item) => {
          return <Tab getTabsWidth={this.getWidth} data={item} key={item.id}></Tab>
        })}
        <AddTab ref={(r) => { this.addTab = r }} />
      </div>
    )
  }
}