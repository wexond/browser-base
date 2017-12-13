import React from 'react'

import { defaultOptions, transitions } from '../../defaults/tabs'

import { addTab } from '../../actions/tabs'

import Store from '../../store'
import { observer } from 'mobx-react'

import Transitions from '../../utils/transitions'

@observer
export default class AddTab extends React.Component {
  constructor () {
    super ()

    this.state = {
      animateLeft: true
    }
  }

  getWidth () {
    return this.addTab.offsetWidth
  }

  render () {
    const {
      animateLeft
    } = this.state

    let transition = '0.2s background-color'

    if (animateLeft) {
      // Add left transition to add tab button.
      const newTransition = transitions.left.duration + 's' + ' left ' + transitions.left.easing 
      transition = Transitions.appendTransition(transition, newTransition)
    }

    const addTabStyle = {
      left: Store.addTabLeft,
      transition: transition
    }

    const onClick = e => {
      e.stopPropagation()
      addTab(defaultOptions)
    }

    return (
      <div className={'add-tab ' + Store.foreground} onClick={onClick} ref={(a) => { this.addTab = a }} style={addTabStyle}>
      </div>
    )
  }
}