class Page {
  constructor (tab) {
    const self = this

    this.elements = {}
    this.tab = tab

    this.elements.page = div(app.elements.pages, { 
      className: 'page'
    })

    this.elements.webview = createElement('webview', this.elements.page, { 
      className: 'page-webview',
      src: 'https://google.pl'
    })
  }

  show () {
    this.elements.page.css({
      pointerEvents: 'auto',
      position: 'relative',
      top: 0,
      visibility: 'visible'
    })
  }

  hide () {
    this.elements.page.css({
      pointerEvents: 'none',
      position: 'absolute',
      top: -99999,
      visibility: 'hidden'
    })
  }
}