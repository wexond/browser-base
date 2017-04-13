import React from 'react'

export default class WebView extends React.Component {
  componentDidMount () {
    const self = this
    this.refs.webview.addEventListener('did-finish-load', function () {
      if (!global.excludedURLs.contains(this.getURL())) {
        self.props.getTab().normalTab()
      }
    })
  }

  render () {
    return (
      <webview ref='webview' className='webview' src={this.props.src} />
    )
  }
}
