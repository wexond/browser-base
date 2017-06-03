class App {
  constructor (rootElement) {
    window.app = this

    this.elements = {}
    this.rootElement = rootElement
    
    this.elements.tabs = new Tabs()

    this.elements.pages = div(rootElement, { className: 'pages' })
  }
}