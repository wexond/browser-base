import '../../app.scss'
import Tabs from '../../components/Tabs'

window.tabs = []
window.defaultTabOptions = {
  select: true,
  url: 'wexond://newtab'
}
window.tabsAnimationData = {
  positioningDuration: 0.2,
  positioningEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
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

// Wait for sass load.
setTimeout(function () {
  new App(document.getElementById('app'))
}, 1)
