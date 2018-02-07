import React from 'react'
import ReactDOM from 'react-dom'

export default class RadioButton extends React.Component {
  constructor () {
    super()

    this.state = {
      toggled: false
    }
  }

  render () {
    const toggled = this.state.toggled

    return (
      <div className={'radio-button ' + (toggled ? 'toggled' : '')} onMouseEnter={() => {
        this.setState({toggled:true})}} onMouseLeave={() => {
          this.setState({toggled:false})}}>
        <div className='border'>
          <div className='circle' />
        </div>
      </div>
    )
  }
}