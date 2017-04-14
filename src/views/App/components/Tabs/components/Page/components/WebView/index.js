import React from 'react'
import BrowserStorage from '../../../../../../../../helpers/BrowserStorage'

export default class WebView extends React.Component {
  componentDidMount () {
    const self = this

    this.getWebView().addEventListener('did-start-loading', function () {
      // Refresh navigation icons in Menu.
      var menu = global.menuWindow
      menu.send('webview:can-go-back', self.getWebView().canGoBack())
      menu.send('webview:can-go-forward', self.getWebView().canGoForward())
    })

    this.getWebView().addEventListener('did-finish-load', function () {
      if (!global.excludedURLs.contains(this.getURL())) {
        self.props.getTab().normalTab()
      }

      var webview = self.getWebView()
      // Check if tab is selected.
      if (self.props.getTab() != null && self.props.getTab().selected) {
        self.props.getApp().updateBarText(webview.getURL())
      }
      // Add history item.
      BrowserStorage.addHistoryItem(webview.getTitle(), webview.getURL())
    })

    this.getWebView().addEventListener('ipc-message', function (e) {
      if (e.channel === 'webview:mouse-left-button') {
        // hide bar on webview click
        var bar = self.props.getApp().getBar()
        if (!bar.locked) {
          bar.hide()
        }
      }
    })
  }

  getWebView = () => {
    return this.refs.webview
  }

  render () {
    return (
      <webview ref='webview' preload='../../preloads/Global' className='webview' src={this.props.src} />
    )
  }
}
