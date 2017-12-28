import React from 'react'

export default class Card extends React.Component {
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
        <div className='card'>
          <div className='image' style={imageStyle} />
          <div className='card-content'>
            <div className='icon' style={iconStyle} />
            <div className='info'>
              <div className='title'>
                {this.props.data.ogData.title || this.props.data.title}
              </div>
              { this.props.description &&
                <div className='description'>
                  {this.props.data.ogData.description}
               </div>
              }
            </div>
          </div>
        </div>
      </a>
    )
  }
}

Card.defaultProps = {
  image: false,
  description: false
}