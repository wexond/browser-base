import React from 'react'

export default class MenuItem extends React.Component {
  constructor () {
    super()

    this.state = {
      visible: true
    }
  }

  componentDidMount () {
    this.props.getMenu().menuItems.push(this)
  }

  render () {
    return (
      <div className='menu-item' onClick={this.props.onClick}>
        <div className='menu-item-text'>
          {this.props.children}
        </div>
      </div>
    )
  }
}
