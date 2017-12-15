import React from 'react'

import Checkbox from '../Checkbox'

export default class HistorySection extends React.Component {
  render () {
    const iconStyle = {
      backgroundImage: `url(${this.props.data.icon})`
    }

    return (
      <div className='history-section-item'>
        <Checkbox />
        <div className='time'>
          {this.props.data.time}
        </div>
        <div className='icon' style={iconStyle} />
        <a href={this.props.data.url} className='title'>
          {this.props.data.title}
        </a>
        <div className='domain'>
          www.youtube.com
        </div>
      </div>
    )
  }
}