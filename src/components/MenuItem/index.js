import React from 'react'

export default class MenuItem extends React.Component {
  componentDidMount () {
    this.props.getMenu().menuItems.push(this)
  }

  render () {
    const self = this

    function onClick () {
      self.props.getMenu().hide()
      if (typeof self.props.onClick === 'function') {
        self.props.onClick()
      }
    }

    return (
      <div style={{display: (this.props.show) ? 'block' : 'none'}} className='menu-item' onClick={onClick}>
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
