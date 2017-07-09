import Component from '../../classes/Component'

export default class Page extends Component {
  beforeRender () {
    this.tab = this.props.tab
  }

  render () {
    return (
      <div className='page' ref='page'>
        <webview ref='webview' className='page-webview' src={this.props.url} />
      </div>
    )
  }

  afterRender () {
    const self = this
    const webview = this.elements.webview

    webview.addEventListener('page-title-updated', (e) => {
      self.tab.setTitle(e.title)

      if (self.tab.selected) {
        app.elements.bar.setTitle(e.title)
        app.elements.bar.setDomain(webview.getURL())
      }
    })

    webview.addEventListener('load-commit', (e) => {
      app.elements.bar.updateNavigationIcons()
      app.elements.webviewMenu.updateNavigationIcons()
    })

    webview.addEventListener('page-favicon-updated', (e) => {
      let request = new XMLHttpRequest()
      request.open('GET', e.favicons[0], false)
      request.send()

      if (request.status !== 404) {
        self.tab.setFavicon(e.favicons[0])
      } else {
        self.tab.setFavicon('')
      }
    })

    webview.addEventListener('did-start-loading', function (e) {
      self.tab.togglePreloader(true)
    })

    webview.addEventListener('did-stop-loading', function (e) {
      self.tab.togglePreloader(false)
      if (self.tab.selected) {
        app.elements.bar.setURL(webview.getURL())
      }

      let color = '#2196F3'

      if (webview.getURL() !== 'wexond://newtab/' || webview.getURL() !== 'wexond://history/') {
        color = '#fff'
      }
      app.changeUIColors(color, self.tab)
    })

    if (app != null) {
      let appElements = app.elements
      let tabsHeight = appElements.tabs.elements.tabs.offsetHeight
      let barHeight = appElements.bar.elements.bar.offsetHeight
      let height = tabsHeight + barHeight

      this.elements.page.css('height', 'calc(100vh - ' + height + 'px)')
    }

    let checkWebcontentsInterval = setInterval(function () {
      if (webview.getWebContents() != null) {
        webview.getWebContents().on('context-menu', function (e, params) {
          const webviewMenu = app.elements.webviewMenu
          let newItems = webviewMenu.menuItems
          app.WCMData = params // Webview context menu data.

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

          for (var i = 0; i < 5; i++) {
            newItems[i].show = params.linkURL !== ''
          }

          for (i = 5; i < 10; i++) {
            newItems[i].show = params.hasImageContents
          }

          for (i = 10; i < 14; i++) {
            newItems[i].show = !params.hasImageContents && params.linkURL === ''
          }

          webviewMenu.updateItems(newItems)

          webviewMenu.show()

          let left = app.cursor.x + 1
          let top = app.cursor.y + 1

          if (left + 300 > window.innerWidth) {
            left = app.cursor.x - 301
          }
          if (top + webviewMenu.height > window.innerHeight) {
            top = app.cursor.y - webviewMenu.height
          }
          if (top < 0) {
            top = 96
          }

          webviewMenu.setPosition(left, top)
        })
        clearInterval(checkWebcontentsInterval)
      }
    }, 1)
  }

  /**
   * Shows page div.
   */
  show () {
    this.elements.page.css({
      pointerEvents: 'auto',
      position: 'relative',
      top: 0,
      visibility: 'visible'
    })
  }

  /**
   * Hides page div.
   */
  hide () {
    this.elements.page.css({
      pointerEvents: 'none',
      position: 'absolute',
      top: -99999,
      visibility: 'hidden'
    })
  }
}
