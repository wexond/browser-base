import React from 'react'
import BrowserStorage from '../../../../../../helpers/BrowserStorage'

export default class WebView extends React.Component {
  componentDidMount () {
    const self = this

    this.getWebView().addEventListener('load-commit', function () {
      // Refresh navigation icons in Menu.
      var menu = global.menuWindow
      menu.send('webview:can-go-back', self.getWebView().canGoBack())
      menu.send('webview:can-go-forward', self.getWebView().canGoForward())

      var contains = false

      for (var i = 0; i < global.excludedURLs.length; i++) {
        if (global.excludedURLs[i].indexOf(this.getURL()) !== -1) {
          contains = true
          break
        }
        if (this.getURL().indexOf(global.excludedURLs[i]) !== -1) {
          contains = true
          break
        }
      }

      if (!contains) {
        self.props.getApp().getTabs().setWidths()
        self.props.getApp().getTabs().setPositions()
        self.props.getPage().setState({height: 'calc(100vh - 32px'})
        self.props.getApp().getTabs().setState({tabsVisible: true})
        self.props.getTab().normalTab()
      }
    })

    this.getWebView().addEventListener('did-finish-load', function () {
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
