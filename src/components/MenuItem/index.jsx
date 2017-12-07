import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

@observer
export default class MenuItem extends Component {
  componentDidMount () {
    this.props.addItem(this)
  }

  render () {
    const onClick = (e) => {
      // Hide parent menu.
      this.props.hide()
      // Execute onClick event.
      if (typeof this.props.onClick === 'function') {
        this.props.onClick(e)
      }
    }

    const style = {
      display: (this.props.visible) ? 'flex' : 'none'
    }

    return (
      <div className='menu-item' onClick={onClick} style={style}>
        {this.props.children}
      </div>
    )
  }
}

MenuItem.defaultProps = {
  visible: true,
  enabled: true
}