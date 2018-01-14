import React from 'react'

export default class HistoryCard extends React.Component {
  render () {
    const {
      fullInfo,
      data,
    } = this.props

    const iconStyle = {
      backgroundImage: `url(${this.props.data.favicon}`
    }

    return (
      <a href={this.props.data.url}>
        <div className={'history-card ' + (fullInfo ? 'full-info' : '')}>
          {fullInfo && <div className='image' style={{backgroundImage: `url(${data.ogData.image})`}} />}
          {!fullInfo && <div className='favicon' style={{backgroundImage: `url(${data.favicon})`}} />}
          <div className='info-container'>
            <span className='title'>
              {data.title}
            </span>
            {data.ogData != null && data.ogData.description != null &&
              <span className='description'>
                {data.ogData.description}
              </span>
            }
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