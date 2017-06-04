import '../../app.scss'
import Tabs from '../../components/Tabs'

const {remote, clipboard} = require('electron')
const {dialog, nativeImage} = remote
const fs = require('fs')
const path = require('path')
const homedir = require('os').homedir()

const userData = path.join(homedir, '.wexond')

const requiredFiles = [
  {
    path: 'history.json',
    defaultContent: '[]'
  }
]

window.currentWindow = remote.getCurrentWindow()
window.tabs = []
window.defaultTabOptions = {
  select: true,
  url: 'wexond://newtab'
}
window.tabsAnimationData = {
  positioningDuration: 0.2,
  positioningEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  hoverDuration: 0.2
}

class App {
  constructor (rootElement) {
    window.app = this

    this.cursor = {}
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
