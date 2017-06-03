class Page {
  constructor (tab) {
    const self = this

    this.elements = {}
    this.tab = tab

    this.elements.page = div({ 
      className: 'page'
    }, app.elements.pages)

    this.elements.webview = createElement('webview', { 
      className: 'page-webview',
      src: 'https://google.pl'
    }, this.elements.page)
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