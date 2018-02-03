import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../../stores/store'

@observer
export default class MenuItem extends React.Component {
  render () {
    const onClick = (e) => {
      // Execute onClick event.
      this.props.onClick(e)
    }

    const style = {
      display: (this.props.visible) ? 'flex' : 'none'
    }

    return (
      <div className={'menu-item ' + ((this.props.selected) ? 'selected' : '')} onClick={onClick} style={style}>
        {this.props.children}
      </div>
    )
  }
}

MenuItem.defaultProps = {
  visible: true,
  enabled: true,
  selected: false
}