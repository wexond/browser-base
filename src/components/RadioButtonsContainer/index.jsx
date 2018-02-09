import React from 'react'
import ReactDOM from 'react-dom'

import RadioButton from '../RadioButton'

export default class RadioButtonsContainer extends React.Component {
  constructor () {
    super()
    this.items = []
  }

  render () {
    const onRadioButtonClick = (e) => {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] !== e) {
          this.items[i].toggle(false)
        }
      }
    }

    return (
      <div className='radio-buttons-container'>
        {
          React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {onClick: onRadioButtonClick, ref: (r) => { this.items.push(r) }})
          })
        }
      </div>
    )
  }
}