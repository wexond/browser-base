import React from 'react'

export default class HistoryCard extends React.Component {
  render () {
    const screenshotStyle = {
      backgroundImage: `url(${this.props.data.screenshot}`
    }

    const iconStyle = {
      backgroundImage: `url(${this.props.data.icon}`
    }

    return (
      <a href={this.props.data.url} class='history-card'>
        <div class='screenshot' style={screenshotStyle} />
        <div class='info-container'>
          <div class='icon' style={iconStyle} />
          <div class='title-container'>
            <div class='title'>
              {this.props.data.title}
            </div>
            <div class='description'>
              {this.props.data.description}
            </div>
          </div>
        </div>
      </a>
    )
  }
}