import Component from 'inferno-component'

import Store from '../../store'

import { connect } from 'inferno-mobx'

import Transitions from '../../utils/transitions'

import { transitions, tabDefaults } from '../../defaults/tabs'

import { close } from '../../actions/window'
import { setPositions, setWidths } from '../../actions/tabs'

@connect
export default class Tab extends Component {
  constructor () {
    super()

    this.state = {
      hovered: false
    }
  }

  componentDidMount () {
    const tab = this.props.data
    if (tab.select) {
      this.select()
    }
  }

  select () {
    Store.selectedTab = Store.tabs.indexOf(this.props.data)
  }

  close = (e) => {
    const tab = this.props.data
    const tabs = this.props.tabs
    const isSelected = Store.selectedTab === Store.tabs.indexOf(tab)

    if (Store.tabs.length === 1) {
      close()
    }
    Store.lastClosedURL = tab.url

    tabs.timer.canReset = true

    tab.renderPage = false

    // Get previous and next tab.
    const index = Store.tabs.indexOf(tab)
    const nextTab = (index === Store.tabs.length - 1) ? null : Store.tabs[index + 1]
    const prevTab = (index === 0) ? null : Store.tabs[index - 1]
    let selectedTab

    if (isSelected) {
      if (nextTab != null) { // If the next tab exists, select it.
        Store.selectedTab = Store.tabs.indexOf(nextTab)
      } else { // If the next tab not exists.
        if (prevTab != null) { // If previous tab exists, select it.
          Store.selectedTab = Store.tabs.indexOf(prevTab)
        } else { // If the previous tab not exists, check if the first tab exists.
          if (Store.tabs[0] != null) { // If first tab exists, select it.
            Store.selectedTab = 0
          }
        }
      }
    }

    tabs.timer.time = 0

    if (index === Store.tabs.length - 1) { // If the tab is last.
      if (tab.width < tabDefaults.maxTabWidth) { // If tab width is less than normal tab width.
        Store.tabs.splice(index, 1)
        tabs.updateTabs()
        return
      }
    }
    tab.animateWidth = true
    tab.closing = true
    Store.tabs[index] = null
    setPositions(1)

    setTimeout(() => {
      Store.tabs.splice(index, 1)
      if (index !== Store.tabs.length) Store.selectedTab--
    }, transitions.width.duration * 1000)
  }

  render () {
    const tab = this.props.data
    const isSelected = Store.selectedTab === Store.tabs.indexOf(tab)

    const {
      width,
      left,
      animateLeft,
      animateWidth,
      title,
      favicon,
      pinned,
      loading,
      render,
      closing
    } = tab

    if (!render) return null

    const {
      hovered
    } = this.state

    let transition = transitions['background-color'].duration + 's' + ' background-color ' + transitions['background-color'].easing 

    if (animateLeft) {
      const newTransition = transitions.left.duration + 's' + ' left ' + transitions.left.easing 
      transition = Transitions.appendTransition(transition, newTransition)
    }

    if (animateWidth) {
      const newTransition = transitions.width.duration + 's' + ' width ' + transitions.width.easing 
      transition = Transitions.appendTransition(transition, newTransition)
    }

    const tabStyle = {
      width: (closing) ? 0 : width,
      left: left,
      transition: transition,
      backgroundColor: (isSelected) ? 'white' : 'transparent',
      zIndex: (isSelected) ? 3 : 1,
      pointerEvents: (closing) ? 'none' : 'auto'
    }

    const faviconStyle = {
      display: (favicon === ''  || (!isSelected && width < 42)) ? 'block' : 'none',
      backgroundImage: `url(${favicon})`
    }

    const closeStyle = {
      display: (pinned  || (!isSelected && width < 42)) ? 'none' : 'block',
      opacity: (isSelected || hovered) ? 1 : 0
    }

    let maxWidthDecrease = 16
    const closeWidth = 16
    const faviconWidth = 16
    const margins = 8
    let titleLeft = 8

    if (isSelected || hovered) maxWidthDecrease += closeWidth + margins
    if (favicon !== '' || loading) {
      maxWidthDecrease += faviconWidth + margins
      titleLeft += faviconWidth + margins
    }

    const titleStyle = {
      maxWidth: `calc(100% - ${maxWidthDecrease}px)`,
      display: (pinned || (!isSelected && width < 42)) ? 'none' : 'block',
      left: titleLeft
    }

    const overlayStyle = {
      opacity: (!isSelected && hovered) ? 1 : 0
    }

    const contentStyle = {
      display: (!isSelected && width < 42) ? 'none' : 'block'
    }

    const onMouseDown = () => {
      if (!isSelected) this.select()
    }

    const onMouseEnter = () => {
      this.setState({hovered: true})
    }

    const onMouseLeave = () => {
      this.setState({hovered: false})
    }

    const tabEvents = {
      onMouseDown: onMouseDown,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave
    }

    return (
      <div ref={(r) => { this.tab = r }} className='tab' style={tabStyle} {...tabEvents}>
        <div className='overlay' style={overlayStyle} />
        <div className='content' style={contentStyle}>
          <div className='favicon' style={faviconStyle} />
          <div className='title' style={titleStyle}>{title}</div>
          <div className='close' onClick={this.close} style={closeStyle} >
            <div className='icon' />
          </div>
        </div>
      </div>
    )
  }
}