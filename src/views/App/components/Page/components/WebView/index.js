import React from 'react'
import BrowserStorage from '../../../../../../helpers/BrowserStorage'

export default class WebView extends React.Component {
  componentDidMount () {
    const self = this

    this.getWebView().addEventListener('load-commit', function () {
      // Refresh navigation icons in Menu.
      const menu = global.menuWindow
      const app = self.props.getApp()
      const tabs = app.getTabs()
      const tab = self.props.getTab()
      const page = self.props.getPage()
      const bar = app.getBar()

      menu.send('webview:can-go-back', self.getWebView().canGoBack())
      menu.send('webview:can-go-forward', self.getWebView().canGoForward())

      let contains = false

      // Check if the url from webview is in excluded URLs.
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

      // If not, show the tabbar.
      if (!contains) {
        tabs.setWidths()
        tabs.setPositions()
        page.setState({height: 'calc(100vh - ' + global.systembarHeight + 'px'})
        tabs.setState({tabsVisible: true})
        tab.normalTab()
        bar.setState({centerVertical: false})
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

  /**
   * Gets webview tag.
   * @return {<webview>}
   */
  getWebView = () => {
    return this.refs.webview
  }

  render () {
    return (
      <webview ref='webview' preload='../../preloads/Global' className='webview' src={this.props.src} />
    )
  }
}
