import React from 'react'

export default class HistoryCard extends React.Component {
  render () {
    const imageStyle = this.props.image && {
      backgroundImage: `url(${this.props.data.ogData.image}`
    } || {
      display: 'none'
    }

    const iconStyle = {
      backgroundImage: `url(${this.props.data.favicon}`
    }

    return (
      <a href={this.props.data.url}>
        <div className='history-card'>
          <div className='image' style={imageStyle} />
          <div className='card-content'>
            <div className='icon' style={iconStyle} />
            <div className='info'>
              <div className='title'>
                {this.props.data.title}
              </div>
              <div className='description'>
                {this.props.data.description}
              </div>
            </div>
          </div>
        </div>
      </a>
    )
  }
}

HistoryCard.defaultProps = {
  image: false
}