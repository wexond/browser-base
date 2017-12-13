import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

@observer
export default class Dialog extends React.Component {
  constructor () {
    super()

    this.state = {
      className: 'hide'
    }
  }

  show () {
    this.setState({
      className: 'show'
    })
  }

  hide () {
    this.setState({
      className: 'hide'
    })
  }

  render () {
    const onBackgroundClick = () => {
      this.hide()
    }

    return (
      <div>
        <div className={'dialog ' + this.state.className}>
          {this.props.children}
        </div>
        <div onClick={onBackgroundClick} className={'background ' + this.state.className}></div>
      </div>
    )
  }
}
