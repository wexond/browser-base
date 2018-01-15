import React from 'react'

export default class NewTabCard extends React.Component {
  render () {
    const {
      url,
      title,
      source,
      urlToImage
    } = this.props.data

    const imageStyle = {
      backgroundImage: `url(${urlToImage})`
    }

    return (
      <a href={url}>
        <div className='new-tab-card'>
          <div className='info-container'>
            <div className='title'>
              {title}
            </div>
            <div className='site-container'>
              <div className='favicon' />
              <span className='domain'>
                {source.name}
              </span>
              <span className='time'>
                - x hours ago
              </span>
            </div>
          </div>
          <div className='image' style={imageStyle} />
        </div>
      </a>
    )
  }
}