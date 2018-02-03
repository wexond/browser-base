import React from 'react'

export default class Item extends React.Component {
  render() {
    return (
      <div className='section-item'>
        <div className='description'>
          {this.props.description}
        </div>
      </div>
    )
  }
}