import React from 'react'

export default class Dropdown extends React.Component {
  constructor () {
    super()

    this.state = {
      selected: -1,
      toggledMenu: false,
      menuHeight: 0,
      menuOpacity: 0
    }
  }

  componentWillMount () {
    if (this.state.selected === -1) {
      this.setState({selected: this.props.selected})
    }
  }

  getMenuHeight () {
    return this.props.items.length * this.props.itemHeight
  }

  openMenu = () => {
    this.toggleMenu(true)
  }
  
  closeMenu = () => {
    this.toggleMenu(false)
  }

  toggleMenu (flag = !this.state.toggledMenu) {
    this.setState({toggledMenu: flag})

    if (flag) {
      this.setState({
        menuOpacity: 1,
        menuHeight: this.getMenuHeight()
      })
    } else {
      this.setState({menuHeight: 0})

      setTimeout(() => {
        this.setState({menuOpacity: 0})
      }, 50)
    }

    if (flag) {
      setTimeout(() => {
        window.addEventListener('mousedown', this.onWindowMouseDown)
      }, 250)
    } else {
      window.removeEventListener('mousedown', this.onWindowMouseDown)
    }
  }

  onWindowMouseDown = (e) => {
    this.closeMenu()
  }

  render () {
    const {
      items
    } = this.props

    const selected = this.state.selected

    const menuStyle = {
      height: this.state.menuHeight,
      opacity: this.state.menuOpacity
    }

    let itemIndex = -1

    return (
      <div className='dropdown-container'>
        <div className='control' onMouseDown={this.openMenu}>
          <div className='selected'>
            {items[selected]}
          </div>
          <div className='icon' />
          <div className='line' />
        </div>
        <div className='menu' style={menuStyle}>
          {
            items.map((data, key) => {
              itemIndex++

              return (
                <div className={'item ' + ((selected === itemIndex) ? 'selected' : '')} key={key}>
                  <div className='text'>
                    {data}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

Dropdown.defaultProps = {
  items: [
    'aha',
    'wtf',
    'xd',
    'no bywa bywa bywa',
    'wtf',
    'kurwa',
    'oc',
    'nersent',
    'jak to',
    'nie wiem'
  ],
  selected: 0,
  itemHeight: 48
}