import React from 'react'
import BrowserStorage from '../../classes/BrowserStorage'

export default class WebView extends React.Component {
  componentDidMount () {
    const self = this
    const app = this.props.getApp()

    let checkWebcontentsInterval = setInterval(function () {
      if (self.getWebView().getWebContents() != null) {
        const event = new Event('webcontents-load')
        self.getWebView().dispatchEvent(event)
        self.getWebView().getWebContents().on('context-menu', function (e) {
          app.refs.webviewmenu.show()
          app.refs.tabmenu.hide()

          let left = app.cursor.x + 1
          let top = app.cursor.y + 1

          if (left + 300 > window.innerWidth) {
            left = app.cursor.x - 301
          }
          if (top + app.refs.webviewmenu.state.height > window.innerHeight) {
            top = app.cursor.y - app.refs.webviewmenu.state.height
          }
          if (top < 0) {
            top = 96
          }

          app.refs.webviewmenu.setState({left: left, top: top})
        })
        clearInterval(checkWebcontentsInterval)
      }
    }, 1)

    this.getWebView().addEventListener('load-commit', function () {
      const app = self.props.getApp()
      const tabs = app.getTabs()
      const page = self.props.getPage()

      // Refresh navigation icons in WebViewMenu.
      app.getWebViewMenu().refreshNavIconsState()
      // Refresh navigation icons in BrowserTabMenu.
      app.getBrowserTabMenu().refreshNavIconsState()

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
        page.setState({top: global.systembarHeight})
        tabs.setState({tabsVisible: true})
      }
    })

    this.getWebView().addEventListener('did-finish-load', function () {
      const webview = self.getWebView()
      const app = self.props.getApp()

      // Refresh navigation icons in WebViewMenu.
      app.getWebViewMenu().refreshNavIconsState()
      // Refresh navigation icons in BrowserTabMenu.
      app.getBrowserTabMenu().refreshNavIconsState()


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

        self.props.getApp().refs.webviewmenu.hide()
        self.props.getApp().refs.tabmenu.hide()
      }
    })

    this.getWebView().addEventListener('page-title-updated', function (e) {
      self.props.getTab().setState({title: e.title})
    })

    this.getWebView().addEventListener('page-favicon-updated', function (e) {
      self.props.getTab().setState({favicon: e.favicons[0]})
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
