import React from 'react'

export default class HistoryCard extends React.Component {
  render () {
    const imageStyle = this.props.displayImage && {
      backgroundImage: `url(${this.props.data.image}`
    } || {
      display: 'none'
    }

    const iconStyle = {
      backgroundImage: `url(${this.props.data.icon}`
    }

    const descriptionStyle = {
      display: this.props.description ? 'block' : 'none'
    }

    return (
      <a href={this.props.data.url}>
        <div className='history-card'>
          <div className='image' style={imageStyle} />
          <div className='info-container'>
            <div className='icon' style={iconStyle} />
            <div className='title-container'>
              <div className='title'>
                {this.props.data.title}
              </div>
              <div className='description' style={descriptionStyle}>
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
  image: true,
  description: true
}