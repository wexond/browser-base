import Component from 'inferno-component'

import Store from '../../store'

import { connect } from 'inferno-mobx'

import Transitions from '../../utils/transitions'

import { transitions } from '../../defaults/tabs'

@connect
export default class Tab extends Component {
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
      animateWidth
    } = tab

    let transition = ''

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
      zIndex: (isSelected) ? 2 : 1
    }

    const onMouseDown = () => {
      if (!isSelected) this.select()
    }

    return (
      <div ref={(r) => { this.tab = r }} className='tab' style={tabStyle} onMouseDown={onMouseDown}>

      </div>
    )
  }
}