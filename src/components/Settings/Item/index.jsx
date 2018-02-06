import React from 'react'

import Ripple from '../../Ripple'

export default class Item extends React.Component {
  render() {
    const {
      title,
      description,
      type
    } = this.props

    return (
      <div className='section-item'>
        <div className='info-container'>
          <div className='title'>
            {title}
          </div>
          <div className='description'>
            {description}
          </div>
        </div>
        <div className='action-container'>
          { type === 'button' && (
              <div className='button-icon icon'>
                <Ripple center={true} />
              </div>
            )
          }
        </div>
      </div>
    )
  }
}