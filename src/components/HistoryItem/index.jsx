import React from 'react'

import Checkbox from '../Checkbox'

import Store from '../../history-store'
import { observer } from 'mobx-react'

@observer
export default class HistoryItem extends React.Component {
  render () {
    const iconStyle = {
      backgroundImage: `url(${this.props.data.favicon})`
    }

    const onCheck = (flag, checkbox) => {
      const data = Object.assign({}, this.props.data)
      data.checkbox = checkbox

      if (flag) {
        Store.selectedItems.push(data)
      } else {
        Store.selectedItems.splice(Store.selectedItems.indexOf(data), 1)
      }
    }

    return (
      <div className='history-section-item'>
        <Checkbox onCheck={onCheck} />
        <div className='time'>
          {this.props.data.time}
        </div>
        <div className='icon' style={iconStyle} />
        <a href={this.props.data.url} className='title'>
          {this.props.data.title}
        </a>
        <div className='domain'>
          {this.props.data.domain}
        </div>
      </div>
    )
  }
}