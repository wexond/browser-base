import React from 'react'

import RadioButton from '../RadioButton'

export default class RadioButtonsContainer extends React.Component {
  constructor () {
    super()
    this.items = []
  }

  render () {
    const onToggle = (e) => {
      this.items = this.items.filter(Boolean)
      
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] != null && this.items[i] !== e.radioButton) {
          this.items[i].toggle(false)
        }
      }

      const eObject = {
        radioButton: e.radioButton,
        id: this.items.indexOf(e.radioButton),
        toggled: e.toggled
      }

      this.props.onToggle(eObject)
    }

    this.items = []

    return (
      <div className='radio-buttons-container'>
        {
          React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {onToggle: onToggle, ref: (r) => { this.items.push(r) }})
          })
        }
      </div>
    )
  }
}