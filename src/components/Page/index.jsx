import Component from '../../component'
import WebViewColors from '../../webview-colors'
import Store from '../../store'

import { getPosition as getMenuPosition } from '../../actions/menu' 

export default class Page extends Component {
  beforeRender () {
    this.tab = this.props.tab
  }

  afterRender () {
    const self = this
    const webview = this.elements.webview

    webview.addEventListener('page-title-updated', (e) => {
      Store.app.elements.bar.updateInfo(webview.getURL(), self.tab)
      self.tab.setTitle(e.title)
    })

    webview.addEventListener('load-commit', (e) => {
      if (self.tab.selected) {
        Store.app.elements.bar.updateNavigationIcons()
        Store.app.elements.webviewMenu.updateNavigationIcons()
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
      Store.app.changeUIColors(e.themeColor, self.tab)
    })

    webview.addEventListener('did-start-loading', function (e) {
      self.tab.togglePreloader(true)

      self.colorInterval = setInterval(() => {
        WebViewColors.getColor(webview, (color) => {
          Store.app.changeUIColors(color, self.tab)
        })
      }, 200)
    })

    webview.addEventListener('did-stop-loading', function (e) {
      self.tab.togglePreloader(false)

      Store.app.elements.bar.updateInfo(webview.getURL(), self.tab)

      WebViewColors.getColor(webview, (color) => {
        Store.app.changeUIColors(color, self.tab)
      })

      clearInterval(self.colorInterval)
    })

    
    let appElements = Store.app.elements
    let tabsHeight = appElements.tabs.elements.tabs.offsetHeight
    let barHeight = appElements.bar.elements.bar.offsetHeight
    let height = tabsHeight + barHeight

    this.elements.page.setCSS({height: 'calc(100vh - ' + height + 'px)'})

    let checkWebcontentsInterval = setInterval(function () {
      if (webview.getWebContents() != null) {
        webview.getWebContents().on('context-menu', function (e, params) {
          const webviewMenu = Store.app.elements.webviewMenu
          let newItems = webviewMenu.menuItems
          Store.pageMenuData = params // Webview context menu data.

          // Context menu items IDs:
          // 0  : Open link in new tab
          // 1  : -----------------------
          // 2  : Copy link address
          // 3  : Save link as
          // 4  : -----------------------
          // 5  : Open image in new tab
          // 6  : Save image as
          // 7  : Copy image
          // 8  : Copy image address
          // 9  : -----------------------
          // 10 : Save as
          // 11 : Print
          // 12 : -----------------------
          // 13 : View source
          // 14 : Inspect element

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

          const position = getMenuPosition(webviewMenu)
          webviewMenu.setPosition(position.left, position.top)
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
    this.elements.page.setCSS({
      position: 'absolute',
      top: 0,
      visibility: 'hidden'
    })

    this.elements.webview.classList.add('hide')
  }

  render () {
    return (
      <div className='page' ref='page'>
        <webview ref='webview' className='page-webview' src={this.props.url} />
      </div>
    )
  }
}
