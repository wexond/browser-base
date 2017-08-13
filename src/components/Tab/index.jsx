import Component from 'inferno-component'

import Store from '../../store'

import { connect } from 'inferno-mobx'

import Transitions from '../../utils/transitions'

import { transitions } from '../../defaults/tabs'

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
      loading
    } = tab

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
      width: width,
      left: left,
      transition: transition,
      backgroundColor: (isSelected) ? 'white' : 'transparent',
      zIndex: (isSelected) ? 3 : 1
    }

    const faviconStyle = {
      display: (favicon !== '') ? 'block' : 'none',
      backgroundImage: `url(${favicon})`
    }

    const closeStyle = {
      display: (pinned || (width < 42 && !isSelected)) ? 'none' : 'block',
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
      display: (pinned || width < 42) ? 'none' : 'block',
      left: titleLeft
    }

    const overlayStyle = {
      opacity: (!isSelected && hovered) ? 1 : 0
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
        <div className='content'>
          <div className='favicon' style={faviconStyle} />
          <div className='title' style={titleStyle}>{title}</div>
          <div className='close' style={closeStyle} >
            <div className='icon' />
          </div>
        </div>
      </div>
    )
  }
}