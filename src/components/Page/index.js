import React from 'react'
import WebView from '../WebView'

export default class Page extends React.Component {
  constructor () {
    super()

    this.state = {
      visible: false,
      render: true,
      top: global.systembarHeight
    }
  }

  componentDidMount () {
    const event = new Event('page-load')
    event.getPage = this.getPage
    this.props.getTab().getDOMNode().dispatchEvent(event)

    if (this.props.getTab().staticIndex === 0) {
      this.setState({top: 0})
    }
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
      visibility: (this.state.visible) ? 'visible' : 'hidden',
      top: this.state.top
    }

    if (!this.state.render) return null

    return (
      <div style={pageStyle} className='page'>
        <WebView getPage={this.getPage} getTab={this.props.getTab} getApp={this.props.getApp} ref='webview' getTab={this.props.getTab} src={this.props.url} />
      </div>
    )
  }
}
