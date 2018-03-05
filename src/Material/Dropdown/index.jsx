import React from 'react'

import Ripple from '../Ripple'

import Item from './Item'

export default class Dropdown extends React.Component {
  constructor () {
    super()

    this.state = {
      selected: -1,
      toggledMenu: false,
      menuOpacity: 0
    }
  }

  componentWillMount () {
    if (this.state.selected === -1) {
      this.setState({selected: this.props.selected})
    }
  }

  openMenu = () => {
    this.scrollIntoCurrentItem()
    this.toggleMenu(true)
  }
  
  closeMenu = () => {
    this.toggleMenu(false)
  }

  toggleMenu (flag = !this.state.toggledMenu) {
    if (this.props.items.length > 0) {
      this.setState({
        toggledMenu: flag,
        menuOpacity: flag ? 1 : 0
      })

      if (flag) {
        setTimeout(() => {
          window.addEventListener('mouseup', this.onWindowMouseDown)
        }, 250)
      } else {
        window.removeEventListener('mouseup', this.onWindowMouseDown)
      }
    }
  }

  onWindowMouseDown = (e) => {
    if (!e.target.hasAttribute('disableDropdropClosing')) {
      this.closeMenu()
    }
  }

  onItemClick = (e, item) => {
    const {
      onSelect
    } = this.props
  
    const {
      index,
      data
    } = item.props


    this.setState({
      selected: index
    })

    if (typeof onSelect === 'function') onSelect(index, data)
  }

  scrollIntoCurrentItem () {
    this.menu.scrollTop = (this.state.selected - 2) * this.props.itemHeight
  }

  render () {
    const {
      items
    } = this.props

    const selected = this.state.selected

    const menuStyle = {
      opacity: this.state.menuOpacity,
      transform: `scale(${this.state.toggledMenu ? 1 : 0})`
    }

    let itemIndex = -1

    return (
      <div className='dropdown-container'>
        <div className='control' onClick={this.openMenu}>
          <div className='selected'>
            {items[selected]}
          </div>
          <div className='icon' />
          <div className='line' />
          <Ripple time={0.6} />
        </div>
        <div className='menu' ref={(r) => this.menu = r} style={menuStyle} disabledropdropclosing='true'>
          {
            items.map((data, key) => {
              itemIndex++
              return <Item index={itemIndex} data={data} selected={selected} onClick={this.onItemClick} key={key} />
            })
          }
        </div>
      </div>
    )
  }
}

Dropdown.defaultProps = {
  items: [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
  ],
  selected: 0,
  itemHeight: 48
}