import React from 'react'

export default class MenuItem extends React.Component {
  componentDidMount () {
    this.props.getMenu().menuItems.push(this)
  }

  render () {
    return (
      <div style={{display: (this.props.show) ? 'block' : 'none'}} className='menu-item' onClick={() => { this.props.getMenu().hide(); this.props.onClick() }}>
        <div className='menu-item-text'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

MenuItem.defaultProps = {
  show: true
}
