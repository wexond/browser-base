import React from 'react'

export default class Section extends React.Component {
  render() {
    const {
      className,
      title,
      children
    } = this.props

    return (
      <div className={'section ' + (className != null ? className : '')}>
        <div className='subheader'>
          {title}
        </div>
        <div className='section-content'>
          {children}
        </div>
      </div>
    )
  }
}