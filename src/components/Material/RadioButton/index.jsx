import React from 'react'

import Ripple from '../Ripple'

export default class RadioButton extends React.Component {
  constructor () {
    super()

    this.state = {
      toggled: false
    }

    this.toggled = false
  }

  componentDidMount () {
    this.toggle(this.props.toggled)
  }

  toggle (flag) {
    if (flag !== this.toggled) {
      const e = {
        radioButton: this,
        toggled: flag
      }

      this.toggled = flag

      this.props.onToggle(e)
    }
    
    this.setState({toggled: flag})
  }

  render () {
    const {
      toggled
    } = this.state

    const onClick = (e) => {
      this.toggle(true)
      if (typeof this.props.onClick === 'function') this.props.onClick(this)
    }

    const onMouseDown = (e) => {
      this.refs.ripple.makeRipple(e)
    }

    return (
      <div className='radio-button-container' onClick={onClick} onMouseDown={onMouseDown}>
        <div className={'radio-button ' + (toggled ? 'toggled' : '')}>
          <div className='border'>
            <div className='circle' />
          </div>
          <Ripple autoRipple={false} ref='ripple' center={true} />
        </div>
        <div className='text'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

RadioButton.defaultProps = {
  toggled: false
}