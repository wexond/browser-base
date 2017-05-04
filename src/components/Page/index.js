import React from 'react'
import BrowserStorage from '../../classes/BrowserStorage'

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
    const self = this
    const app = this.props.getApp()

    let event = new Event('page-load')
    event.getPage = this.getPage
    this.props.getTab().getDOMNode().dispatchEvent(event)

    if (this.props.getTab().staticIndex === 0) {
      this.setState({top: 0})
    }

    global.pages.push(this)

    let checkWebcontentsInterval = setInterval(function () {
      if (self.webview.getWebContents() != null) {
        event = new Event('webcontents-load')
        self.webview.dispatchEvent(event)
        self.webview.getWebContents().on('context-menu', function (e) {
          app.webviewMenu.show()
          app.tabMenu.hide()

          let left = app.cursor.x + 1
          let top = app.cursor.y + 1

          if (left + 300 > window.innerWidth) {
            left = app.cursor.x - 301
          }
          if (top + app.webviewMenu.state.height > window.innerHeight) {
            top = app.cursor.y - app.webviewMenu.state.height
          }
          if (top < 0) {
            top = 96
          }

          app.webviewMenu.setState({left: left, top: top})
        })
        clearInterval(checkWebcontentsInterval)
      }
    }, 1)

    this.webview.addEventListener('load-commit', function () {
      const app = self.props.getApp()
      const tabs = app.tabs

      // Refresh navigation icons in webview menu.
      app.webviewMenu.refreshNavIconsState()
      // Refresh navigation icons in tab menu.
      app.tabMenu.refreshNavIconsState()

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
        self.setState({top: global.systembarHeight})
        tabs.setState({tabsVisible: true})
      }
    })

    this.webview.addEventListener('did-finish-load', function () {
      const webview = self.webview
      const app = self.props.getApp()

      // Refresh navigation icons in webview menu.
      app.webviewMenu.refreshNavIconsState()
      // Refresh navigation icons in tab menu.
      app.tabMenu.refreshNavIconsState()


      // Check if tab is selected.
      if (self.props.getTab() != null && self.props.getTab().selected) {
        self.props.getApp().updateBarText(webview.getURL())
      }
      // Add history item.
      BrowserStorage.addHistoryItem(webview.getTitle(), webview.getURL())
    })

    this.webview.addEventListener('ipc-message', function (e) {
      if (e.channel === 'webview:mouse-left-button') {
        // hide bar on webview click
        var bar = self.props.getApp().bar
        if (!bar.locked) {
          bar.hide()
        }

        self.props.getApp().webviewMenu.hide()
        self.props.getApp().tabMenu.hide()
      }
    })

    this.webview.addEventListener('page-title-updated', function (e) {
      self.props.getTab().setState({title: e.title})
    })

    this.webview.addEventListener('page-favicon-updated', function (e) {
      self.props.getTab().setState({favicon: e.favicons[0]})
    })
  }

  componentWillUnmount () {
    global.pages.splice(global.pages.indexOf(this))
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
        <webview ref={(r) => { this.webview = r }} preload='../../preloads/Global' className='webview' src={this.props.url} />
      </div>
    )
  }
}
