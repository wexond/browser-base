import React from 'react'

import tabDefaults from '../../defaults/tabs'

import * as tabsActions from '../../actions/tabs'

import { observer } from 'mobx-react'
import Store from '../../store'

import Transitions from '../../utils/transitions'

interface Props {

}

interface State {
  animateLeft: boolean,
}

@observer
export default class AddTab extends React.Component<Props, State> {

  public addTab: HTMLDivElement

  constructor(props: Props) {
    super(props)

    this.state = {
      animateLeft: true
    }
  }

  public getWidth() {
    return this.addTab.offsetWidth
  }

  public render(): JSX.Element {
    const {
      animateLeft
    } = this.state

    let transition = '0.2s background-color'

    if (animateLeft) {
      // Add left transition to add tab button.
      const newTransition = tabDefaults.transitions.left.duration + 's' + ' left ' + tabDefaults.transitions.left.easing
      transition = Transitions.appendTransition(transition, newTransition)
    }

    const addTabStyle = {
      left: Store.addTabLeft,
      transition
    }

    const onClick = (e): void => {
      e.stopPropagation()
      tabsActions.addTab()
    }

    return (
      <div className={'add-tab ' + Store.foreground} onClick={onClick} ref={(a) => { this.addTab = a }} style={addTabStyle}>
      </div>
    )
  }
}