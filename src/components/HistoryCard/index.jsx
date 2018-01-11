import React from 'react'

export default class HistoryCard extends React.Component {
  render () {
    const {
      fullInfo
    } = this.props

    const iconStyle = {
      backgroundImage: `url(${this.props.data.favicon}`
    }

    return (
      <a href={this.props.data.url}>
        <div className={'history-card ' + (fullInfo ? 'full-info' : '')}>
          <div className='image' />
          <div className='favicon' />
          <div className='info-container'>
            <span className='title'>
              GitHub
            </span>
            <span className='description'>
              GitHub is where people build software. More than 26 million people use GitHub to discover, fork, and contribute to over 74 million projects.
            </span>
          </div>
        </div>
      </a>
    )
  }
}

HistoryCard.defaultProps = {
  image: false,
  description: false,
  fullInfo: false
}