export default class Page {
  constructor (tab) {
    const self = this

    this.elements = {}
    this.tab = tab

    this.elements.page = div({ 
      className: 'page'
    }, app.elements.pages)

    this.elements.webview = createElement('webview', { 
      className: 'page-webview',
      src: 'about:blank'
    }, this.elements.page)

    this.elements.webview.addEventListener('page-title-updated', (e) => {
      self.tab.setTitle(e.title)
    })

    this.elements.webview.addEventListener('page-favicon-updated', (e) => {
      self.tab.setFavicon(e.favicons[0])
    })
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