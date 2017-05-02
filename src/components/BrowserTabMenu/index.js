import React from 'react'
import MenuItem from '../MenuItem'

export default class BrowserTabMenu extends React.Component {
  constructor () {
    super()

    this.state = {
      height: 0,
      marginTop: -20,
      opacity: 0,
      top: 0,
      left: 0
    }

    this.menuItems = []
  }

  /**
   * Shows menu.
   */
  show = () => {
    let separatorsCount = this.refs.menu.getElementsByClassName('menu-separator').length
    let topBottomPadding = 24
    let separatorsMargins = 16
    let navIconsHeight = 48
    let height = navIconsHeight + separatorsCount + separatorsCount * separatorsMargins + topBottomPadding
    for (var i = 0; i < this.menuItems.length; i++) {
      if (this.menuItems[i].shown) {
        height += 32
      }
    }

    this.setState(
      {
        marginTop: 0,
        opacity: 1,
        height: height
      }
    )
  }

  /**
   * Hides menu.
   */
  hide = () => {
    this.setState(
      {
        marginTop: -20,
        opacity: 0,
        height: 0
      }
    )
  }

  /**
   * Gets menu.
   * @return {WebViewMenu}
   */
  getMenu = () => {
    return this
  }

  render () {
    let menuStyle = {
      height: this.state.height,
      marginTop: this.state.marginTop,
      opacity: this.state.opacity,
      top: this.state.top,
      left: this.state.left
    }

    return (
      <div ref='menu' className='menu' style={menuStyle}>
        <div className='navigation-icons'>
          <div className='navigation-icon-back' />
          <div className='navigation-icon-forward' />
          <div className='navigation-icon-refresh' />
          <div className='navigation-icon-star' />
        </div>
        <div className='menu-line' />
        <div className='menu-items'>
          <MenuItem getMenu={this.getMenu}>
            Add new tab
          </MenuItem>
          <div className='menu-separator' />
          <MenuItem getMenu={this.getMenu}>
            Pin tab
          </MenuItem>
          <MenuItem getMenu={this.getMenu}>
            Mute tab
          </MenuItem>
          <MenuItem getMenu={this.getMenu}>
            Duplicate
          </MenuItem>
          <div className='menu-separator' />
          <MenuItem getMenu={this.getMenu}>
            Close tab
          </MenuItem>
          <MenuItem getMenu={this.getMenu}>
            Close other tabs
          </MenuItem>
          <MenuItem getMenu={this.getMenu}>
            Close tabs from left
          </MenuItem>
          <MenuItem getMenu={this.getMenu}>
            Close tabs from right
          </MenuItem>
          <div className='menu-separator' />
          <MenuItem getMenu={this.getMenu}>
            Revert closed tab
          </MenuItem>
        </div>
      </div>
    )
  }
}
