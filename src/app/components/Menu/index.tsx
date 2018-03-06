import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import MenuItem from '../MenuItem'

interface Props {
  left: number,
  right: number,
  top: number,
  bottom: number,
  onVisibilityChange: Function,
  itemsStyle: any
}

interface State {
  height: number,
  marginTop: number,
  opacity: number,
  left: number,
  top: number,
  right?: number,
  bottom?: number,
  items: any,
  pointerEvents: boolean
}

@observer
export default class Menu extends React.Component<Props, State> {

  public visible: boolean
  public newHeight: number
  public menu: HTMLDivElement
  constructor (props: Props) {
    super(props)

    this.state = {
      marginTop: 0,
      opacity: 0,
      height: 0,
      left: 0,
      top: 0,
      pointerEvents: false,
      items: []
    }

    this.visible = false
  }

  public static defaultProps = {
    left: 'auto',
    top: 'auto',
    right: 'auto',
    bottom: 'auto'
  }

  public componentDidMount () {
    this.setState({
      left: this.props.left,
      top: this.props.top,
      right: this.props.right,
      bottom: this.props.bottom
    })
  }

  public refreshHeight = () => {
    setTimeout(() => {
      this.menu.style.transition = '0.27s margin-top, 0.2s opacity'
      this.newHeight = this.menu.scrollHeight
      this.setState({height: this.newHeight})
    }, 50)
  }

  public show = () => {
    // Remove height transition to quickly set height to 0.
    this.menu.style.transition = '0.27s margin-top, 0.2s opacity'
    this.setState({height: 0})

    // Store the new calculated height,
    // to help with calculating new position of menu.
    this.newHeight = this.menu.scrollHeight

    // Need to use little timeout
    // for setting height and transitions.
    setTimeout(() => {
      // Revert height transition.
      this.menu.style.transition = '0.3s max-height, 0.27s margin-top, 0.2s opacity'
      this.setState({
        marginTop: 0,
        opacity: 1,
        height: this.newHeight,
        pointerEvents: true
      })
    }, 10)

    this.visible = true

    if (typeof this.props.onVisibilityChange === 'function') { this.props.onVisibilityChange(this.visible) }
  }

  public hide = () => {
    this.setState({
      marginTop: -20,
      opacity: 0,
      pointerEvents: false
    })

    this.visible = false

    if (typeof this.props.onVisibilityChange === 'function') { this.props.onVisibilityChange(this.visible) }
  }

  public render () {
    const {
      height,
      marginTop,
      opacity,
      left,
      top,
      right,
      bottom,
      items,
      pointerEvents
    } = this.state

    const menuStyle = {
      maxHeight: (height > 400) ? 400 : height,
      marginTop,
      opacity,
      left,
      top,
      bottom,
      right,
      pointerEvents: (pointerEvents) ? 'auto' : 'none'
    }

    const onMouseDown = (e: any) => {
      e.stopPropagation()
    }

    const onClick = (e: any) => {
      e.stopPropagation()
    }

    const menuEvents = {
      onMouseDown,
      onClick
    }

    let menuItems = null
    if (items != null && items.length !== 0) { menuItems = (
      <div className='items' style={this.props.itemsStyle}>
        {
          items.map((data: any, key: string) => {
            // Default values for an item.
            if (data.visible == null) { data.visible = true }
            if (data.type == null) { data.type = 'item' }

            if (data.type === 'separator') {
              const separatorStyle = {
                display: (data.visible) ? 'block' : 'none'
              }

              return <div style={separatorStyle} key={key} className='separator' />
            } else if (data.type === 'item') {

              const onClick = () => {
                if (typeof data.onClick === 'function') { data.onClick() }
                this.hide()
              }

              const methodsToPass = {
                onClick
              }

              return (
                <MenuItem enabled={data.enabled} visible={data.visible} key={key} {...methodsToPass}>
                  {data.title}
                </MenuItem>
              )
            }
          })
        }
      </div>
    )
    }

    return (
      <div {...menuEvents} className='menu' style={menuStyle} ref={(r) => { this.menu = r }}>
        {this.props.children}
        {menuItems}
      </div>
    )
  }
}
