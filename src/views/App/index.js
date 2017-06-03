window.tabs = []
window.defaultTabOptions = {
  select: true,
  url: 'wexond://newtab'
}

class App {
  constructor (rootElement) {
    window.app = this

    this.elements = {}
    this.rootElement = rootElement

    app.elements.pages = div({ className: 'pages' })

    this.elements.tabs = new Tabs()

    app.rootElement.appendChild(app.elements.pages)
  }
}