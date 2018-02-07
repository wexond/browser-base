import React from 'react'
import ReactDOM from 'react-dom'

export default class RadioButtonsContainer extends React.Component {
  render () {
    return (
      <div className='radio-buttons-container'>
        {this.props.children}
      </div>
    )
  }
}