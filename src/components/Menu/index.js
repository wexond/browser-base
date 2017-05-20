import React from 'react'
import MenuItem from '../MenuItem'

export default class Menu extends React.Component {
  constructor () {
    super()
    this.state = {
      menuItems: [],
      height: 0,
      marginTop: -20,
      opacity: 0
    }

    this.menuItems = []
    this.shown = false
  }

  /**
   * Shows menu.
   */
  show = () => {
    let separators = this.refs.menu.getElementsByClassName('menu-separator')
    let separatorsCount = 0
    for (var i = 0; i < separators.length; i++) {
      if (separators[i].style.display === 'block') {
        separatorsCount += 1
      }
    }
    let topBottomPadding = 32
    let separatorsMargins = 16
    let extensionsIconsHeight = 0 // TODO
    let height = extensionsIconsHeight + separatorsCount + separatorsCount * separatorsMargins + topBottomPadding

    for (i = 0; i < this.menuItems.length; i++) {
      if (this.menuItems[i].props.show) {
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

    this.shown = true
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

    this.shown = false
  }

  /**
   * Gets menu (this)
   * @return {Menu}
   */
  getMenu = () => {
    return this
  }

  render () {
    const self = this

    let menuStyle = {
      height: this.state.height,
      marginTop: this.state.marginTop,
      opacity: this.state.opacity
    }

    /** Events */

    function onClick (e) {
      e.stopPropagation()
    }

    return (
      <div>
        <div ref='menu' onClick={onClick} className='menu' style={menuStyle}>
        <div className='menu-items'>
          {
            this.state.menuItems.map((data, key) => {
              if (data.type === 'separator') {
                let displaySeparator = true
                if (data.show === false) {
                  displaySeparator = false
                }

                return <div style={{display: (displaySeparator) ? 'block' : 'none'}} key={key} className='menu-separator' />
              }
              if (data.type === 'menu-item') {
                return (
                  <MenuItem enabled={data.enabled} show={data.show} key={key} onClick={data.onClick} getMenu={self.getMenu}>
                    {data.title}
                  </MenuItem>
                )
              }
            })
          }
        </div>
      </div>
      </div>
    )
  }
}
