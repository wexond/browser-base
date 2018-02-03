import React from 'react'

export default class Section extends React.Component {
  render() {
    return (
      <div className='section'>
        <div className='subheader'>
          {this.props.title}
        </div>
        <div className='section-content'>
          {this.props.children}
        </div>
      </div>
    )
  }
}