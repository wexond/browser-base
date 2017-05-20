import React from 'react'
import MenuItem from '../MenuItem'

export default class Menu extends React.Component {
  constructor () {
    super()
    this.state = {
      menuItems: []
    }

    this.menuItems = []
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
    return (
      <div>
        <div ref='menu' className='menu'>
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
