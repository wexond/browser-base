import Component from '../../classes/Component'
import WebViewColors from '../../classes/WebViewColors'

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
      app.elements.bar.retrieveInformation(webview.getURL(), self.tab)
      self.tab.setTitle(e.title)
    })

    webview.addEventListener('load-commit', (e) => {
      if (self.tab.selected) {
        app.elements.bar.updateNavigationIcons()
        app.elements.webviewMenu.updateNavigationIcons()
      }
    })

    webview.addEventListener('page-favicon-updated', (e) => {
      let request = new XMLHttpRequest()
      request.onreadystatechange = function (event) {
        if (request.readyState === 4) {
          if (request.status === 404) {
            self.tab.setFavicon('')
          } else {
            self.tab.setFavicon(e.favicons[0])
          }
        }
      }

      request.open('GET', e.favicons[0], true)
      request.send(null)
    })

    webview.addEventListener('did-change-theme-color', (e) => {
      app.changeUIColors(e.themeColor, self.tab)
    })

    webview.addEventListener('did-start-loading', function (e) {
      self.tab.togglePreloader(true)

      self.colorInterval = setInterval(() => {
        WebViewColors.getColor(webview, (color) => {
          app.changeUIColors(color, self.tab)
        })
      }, 200)
    })

    webview.addEventListener('did-stop-loading', function (e) {
      self.tab.togglePreloader(false)

      app.elements.bar.retrieveInformation(webview.getURL(), self.tab)

      WebViewColors.getColor(webview, (color) => {
        app.changeUIColors(color, self.tab)
      })

      clearInterval(self.colorInterval)
    })

    if (app != null) {
      let appElements = app.elements
      let tabsHeight = appElements.tabs.elements.tabs.offsetHeight
      let barHeight = appElements.bar.elements.bar.offsetHeight
      let height = tabsHeight + barHeight

      this.elements.page.setCSS('height', 'calc(100vh - ' + height + 'px)')
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
    this.elements.page.setCSS({
      position: 'relative',
      top: 'auto',
      visibility: 'visible'
    })

    this.elements.webview.classList.remove('hide')
  }

  /**
   * Hides page div.
   */
  hide () {
    const self = this

    this.elements.page.setCSS({
      position: 'absolute',
      top: -99999,
      visibility: 'hidden'
    })

    self.elements.webview.classList.add('hide')
  }
}
