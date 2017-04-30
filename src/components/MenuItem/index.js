import React from 'react'

export default class MenuItem extends React.Component {
  constructor () {
    super()

    this.shown = true
  }

  componentDidMount () {
    this.props.getMenu().menuItems.push(this)
  }

  render () {
    return (
      <div className='menu-item'>
        <div className='menu-item-text'>
          {this.props.children}
        </div>
      </div>
    )
  }
}
