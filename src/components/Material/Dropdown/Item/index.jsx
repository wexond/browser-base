import React from 'react'

import Ripple from '../../Ripple'

export default class Item extends React.Component {
  render () {
    const {
      index,
      data,
      selected,
      onClick
    } = this.props

    const _onClick = (e) => {
      if (typeof onClick === 'function') onClick(e, this)
    }

    return (
      <div className={'item ' + ((selected === index) ? 'selected' : '')} onClick={_onClick}>
        <div className='text'>
          {data}
        </div>
        <Ripple time={0.6} />
      </div>
    )
  }
}