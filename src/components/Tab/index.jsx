import Component from 'inferno-component'

import Store from '../../store'

import { connect } from 'inferno-mobx'

import Transitions from '../../utils/transitions'

import { transitions, tabDefaults } from '../../defaults/tabs'
import wexondUrls from '../../defaults/wexond-urls'

import { close } from '../../actions/window'
import { setPositions, setWidths } from '../../actions/tabs'

@connect
export default class Tab extends Component {
  constructor () {
    super()

    this.state = {
      hovered: false
    }
    this.dragData = {}
  }

  componentDidMount () {
    const tab = this.props.tab
  
    if (tab.select) this.select()
  }

  select () {
    const tab = this.props.tab

    Store.selectedTab = this.props.tab.id
  }

  close = (e) => {
    const tab = this.props.tab
    const tabs = this.props.tabs
    const isSelected = Store.selectedTab === tab.id

    // Close window when the tab is last.
    if (Store.tabs.length === 1) {
      close()
    }

    // Get the tab url and store in Store.
    Store.lastClosedURL = tab.url

    tab.renderPage = false

    // Get previous and next tab.
    let index = Store.tabs.indexOf(tab)

    // Get page from array by its unique id.
    let page = Store.pages.filter(page => {
      return tab.id === page.id
    })[0]

    // Remove page from array.
    Store.pages.splice(Store.pages.indexOf(page), 1)

    // Remove tab from array.
    Store.tabs.splice(index, 1)

    // If the closed tab was selected, select other tab.
    if (isSelected) {
      if (index === Store.tabs.length) { // If the tab is last.
        Store.selectedTab = Store.tabs[index - 1].id // Select previous tab.
      } else {
        Store.selectedTab = Store.tabs[index].id // Select next tab.
      }
    }

    tabs.resetTimer()

    // If the tab is last.
    if (index === Store.tabs.length) {
      // If tab width is less than normal tab width and the tab width is greater than 32.
      if (tab.width < tabDefaults.maxTabWidth && tab.width > 32) {
        tab.render = false
        tabs.updateTabs()
        return
      }
    }
    
    // Animate tabs.
    tab.animateWidth = true
    tab.closing = true
    setPositions()
  }

  render () {
    const tab = this.props.tab
    const isSelected = Store.selectedTab === tab.id
    const tabs = this.props.tabs

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

    // Control transitions.
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

    // Set title max width, based on favicon and close visibility.
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
      opacity: ((!isSelected && hovered) || closing) ? 1 : 0,
      backgroundColor: (closing) ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.5)'
    }

    const contentStyle = {
      display: (!isSelected && width < 42) ? 'none' : 'block'
    }

    const borderLeftStyle = {
      display: (isSelected) ? 'block' : 'none',
      left: 0
    }

    const selectedTab = Store.tabs.filter(ttab => {
      return tab.id === Store.selectedTab
    })

    const borderRightStyle = {
      display: (Store.tabs.indexOf(selectedTab) - 1 === Store.tabs.indexOf(tab)) ? 'none' : 'block',
      right: (isSelected) ? 0 : -1,
      height: (isSelected) ? '100%' : 'calc(100% - 8px)'
    }

    const onMouseDown = (e) => {
      e.preventDefault()
      if (!isSelected) this.select()
      Store.tabDragData = {
        isMouseDown: true,
        mouseClickX: e.clientX + tabs.tabs.scrollLeft,
        left: left,
        tab: tab
      }
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
      onMouseLeave: onMouseLeave,
    }

    if (isSelected && tab.url === 'wexond://newtab') {
      Store.app.bar.focus()
    }

    if (isSelected) {
      Store.app.bar.setURL(tab.url)
    }

    return (
      <div ref={(r) => { this.tab = r }} className='tab' style={tabStyle} {...tabEvents}>
        <div className='overlay' style={overlayStyle} />
        <div className='border-vertical' style={borderLeftStyle} />
        <div className='border-vertical' style={borderRightStyle} />
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