import React from 'react'
import ReactDOM from 'react-dom'

import RadioButton from '../RadioButton'

export default class RadioButtonsContainer extends React.Component {
  render () {
    const {
      items
    } = this.props

    return (
      <div className='radio-buttons-container'>
        {
          items.map((data, key) => {
            return <RadioButton data={data} key={key} />
          })
        }
      </div>
    )
  }
}