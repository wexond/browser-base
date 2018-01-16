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
          {fullInfo && <div className='image' style={{backgroundImage: `url(${data.ogdata.image})`}} />}
          {!fullInfo && <div className='favicon' style={{backgroundImage: `url(${data.favicon})`}} />}
          <div className='info-container'>
            <span className='title'>
              {data.title}
            </span>
            {data.ogdata != null && data.ogdata.description != null &&
              <span className='description'>
                {data.ogdata.description}
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