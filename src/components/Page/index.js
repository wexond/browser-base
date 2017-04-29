import React from 'react'
import WebView from './components/WebView'

export default class Page extends React.Component {
  constructor () {
    super()

    this.state = {
      visible: false,
      render: true,
      height: '100vh'
    }
  }

  componentDidMount () {
    const event = new Event('page-load')
    event.getPage = this.getPage
    this.props.getTab().getDOMNode().dispatchEvent(event)
  }

  /**
   * Gets webview tag from WebView component.
   * @return {<webview>}
   */
  getWebView = () => {
    return this.refs.webview.getWebView()
  }

  /**
   * Gets Page.
   * @return {Page}
   */
  getPage = () => {
    return this
  }

  render () {
    var pageStyle = {
      opacity: (this.state.visible) ? 1 : 0,
      position: (this.state.visible) ? 'relative' : 'absolute',
      zIndex: (this.state.visible) ? 1 : -1,
      top: (this.state.visible) ? 0 : -window.innerHeight - 50,
      height: this.state.height
    }

    if (this.state.render) {
      return (
        <div style={pageStyle} className='page'>
          <WebView getPage={this.getPage} getTab={this.props.getTab} getApp={this.props.getApp} ref='webview' getTab={this.props.getTab} src={this.props.url} />
        </div>
      )
    } else {
      return null
    }
  }
}
