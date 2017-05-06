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
    this.getTab = this.props.getTab

    const self = this
    const app = this.props.getApp()
    const tab = this.getTab()

    let event = new Event('page-load')
    event.getPage = this.getPage
    this.props.getTab().getDOMNode().dispatchEvent(event)

    if (this.props.getTab().staticIndex === 0) {
      this.setState({top: 0})
    }

    let checkWebcontentsInterval = setInterval(function () {
      if (self.webview.getWebContents() != null) {
        event = new Event('webcontents-load')
        self.webview.dispatchEvent(event)
        self.webview.getWebContents().on('context-menu', function (e, params) {
          app.webviewMenu.setState((previousState) => {
            /**
             * 0  : Open link in new tab
             * 1  : -----------------------
             * 2  : Copy link address
             * 3  : Save link as
             * 4  : -----------------------
             * 5  : Open image in new tab
             * 6  : Save image as
             * 7  : Copy image
             * 8  : Copy image address
             * 9  : -----------------------
             * 10 : Save as
             * 11 : Print
             * 12 : -----------------------
             * 13 : View source
             * 14 : Inspect element
             */
            let menuItems = previousState.menuItems
            for (var i = 0; i < 5; i++) {
              menuItems[i].show = params.linkURL !== ''
            }

            for (i = 5; i < 10; i++) {
              menuItems[i].show = params.hasImageContents
            }

            for (i = 10; i < 14; i++) {
              menuItems[i].show = !params.hasImageContents && params.linkURL === ''
            }

            return {
              menuItems: menuItems
            }
          })

          app.webviewMenu.show()
          app.tabMenu.hide()
          app.WCMData = params // Webview context menu data.

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

          console.log(params)

          app.webviewMenu.setState({left: left, top: top})
        })
        clearInterval(checkWebcontentsInterval)
      }
    }, 1)

    this.webview.addEventListener('load-commit', function () {
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

      // Refresh navigation icons in webview menu.
      app.webviewMenu.refreshNavIconsState()
      // Refresh navigation icons in tab menu.
      app.tabMenu.refreshNavIconsState()


      // Check if tab is selected.
      if (tab != null && tab.selected) {
        app.updateBarText(webview.getURL())
      }
      // Add history item.
      BrowserStorage.addHistoryItem(webview.getTitle(), webview.getURL())
    })

    this.webview.addEventListener('ipc-message', function (e) {
      if (e.channel === 'webview:mouse-left-button') {
        // hide bar on webview click
        var bar = app.bar
        if (!bar.locked) {
          bar.hide()
        }

        app.webviewMenu.hide()
        app.tabMenu.hide()
      }
    })

    this.webview.addEventListener('page-title-updated', function (e) {
      tab.setState({title: e.title})
    })

    this.webview.addEventListener('page-favicon-updated', function (e) {
      tab.setState({favicon: e.favicons[0]})
    })
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
