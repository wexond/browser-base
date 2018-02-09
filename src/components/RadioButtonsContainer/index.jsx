import React from 'react'
import ReactDOM from 'react-dom'

import RadioButton from '../RadioButton'

export default class RadioButtonsContainer extends React.Component {
  constructor () {
    super()

    this.state = {
      selectedItem: -1
    }
  }

  componentWillMount () {
    this.setState({
      selectedItem: this.props.selected
    })
  }

  onRadioButtonClick = (item) => {
    const index = item.props.index

    if (this.state.selectedItem !== index) {
      this.setState({
        selectedItem: index
      })

      this.triggerOnToggle()
    }
  }

  triggerOnToggle () {
    const onToggle = this.props.onToggle

    if (typeof onToggle === 'function') onToggle(this.state.selectedItem)
  }

  render () {
    const {
      items
    } = this.props

    const selectedItem = this.state.selectedItem

    let index = -1

    return (
      <div className='radio-buttons-container'>
        {
          items.map((data, key) => {
            index++

            const toggled = selectedItem === index

            return <RadioButton text={data} key={key} toggled={toggled} index={index} onClick={this.onRadioButtonClick} />
          })
        }
      </div>
    )
  }
}

RadioButtonsContainer.defaultProps = {
  selected: 0
}