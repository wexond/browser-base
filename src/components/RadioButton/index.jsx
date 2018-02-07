import React from 'react'
import ReactDOM from 'react-dom'

import Ripple from '../Ripple'

export default class RadioButton extends React.Component {
  onClick = (e) => {
    const onClick = this.props.onClick

    if (typeof onClick === 'function') onClick(this)
  }

  render () {
    const {
      toggled,
      text
    } = this.props

    return (
      <div className='radio-button-container'>
        <div className={'radio-button ' + (toggled ? 'toggled' : '')} onClick={this.onClick}>
          <div className='border'>
            <div className='circle' />
          </div>
          <Ripple center={true} />
        </div>
        { text && (
            <div className='text'>
              {text}
            </div>
          )
        }
      </div>
    )
  }
}