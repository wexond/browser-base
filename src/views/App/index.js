import React from 'react'
import ReactDOM from 'react-dom'
import Tabs from '../../components/Tabs'
import Bar from '../../components/Bar'
import Page from '../../components/Page'
import ContextMenu from '../../components/ContextMenu'
import MenuItem from '../../components/MenuItem'

import '../../helpers/Arrays'

import '../../app.scss'

const {remote, clipboard} = require('electron')
const fs = require('fs')
const path = require('path')
const homedir = require('os').homedir()
const nativeImage = remote.nativeImage

const userData = path.join(homedir, '.wexond')

const requiredFiles = [
  {
    path: 'history.json',
    defaultContent: '[]'
  }
]

window.global = {
  currentWindow: remote.getCurrentWindow(),
  remote: remote,
  clipboard: clipboard,
  tabs: [],
  pages: [],
  tabsData: {
    pinnedTabWidth: 32,
    maxTabWidth: 190,
    newTabWidth: 32
  },
  tabsAnimationData: {
    positioningDuration: 0.2,
    hoverDuration: 0.2,
    positioningEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  },
  defaultOptions: {
    select: true,
    url: 'wexond://newtab'
  },
  excludedURLs: ['wexond://newtab'],
  historyPath: path.join(userData, 'history.json'),
  systembarHeight: 32
}

if (!fs.existsSync(userData)) {
  fs.mkdir(userData)
}

for (var i = 0; i < requiredFiles.length; i++) {
  let file = path.join(userData, requiredFiles[i].path)

  if (!fs.existsSync(file)) {
    fs.writeFile(file, requiredFiles[i].defaultContent, function (err) {
      if (err) console.error(err)
    })
  }
}

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      pagesToCreate: []
    }

    this.cursor = {}
  }

  componentDidMount () {
    const self = this

    this.tabs.tabbar.addEventListener('contextmenu', function (e) {
      if (e.target !== self.tabs.addButton) {
        self.tabMenu.show()
        self.webviewMenu.hide()

        let left = e.pageX + 1
        let top = e.pageY + 1

        if (left + 300 > window.innerWidth) {
          left = e.pageX - 301
        }
        if (top + self.tabMenu.state.height > window.innerHeight) {
          top = e.pageY - self.tabMenu.state.height
        }
        if (top < 0) {
          top = 96
        }

        self.tabMenu.setState({left: left, top: top})
      }
    })

    window.addEventListener('click', function () {
      self.tabMenu.hide()
      self.webviewMenu.hide()
    })

    this.webviewMenu.setState(
      {
        menuItems: [
          {
            title: 'Open link in new tab',
            type: 'menu-item',
            show: false,
            onClick: function () {
              let data = self.WCMData
              self.tabs.addTab({select: false, url: data.linkURL})
            }
          },
          {
            type: 'separator',
            show: false
          },
          {
            title: 'Copy link address',
            type: 'menu-item',
            show: false,
            onClick: function () {
              let data = self.WCMData
              clipboard.clear()
              clipboard.writeText(data.linkURL)
            }
          },
          {
            title: 'Save link as',
            type: 'menu-item',
            show: false
          },
          {
            type: 'separator',
            show: false
          },
          {
            title: 'Open image in new tab',
            type: 'menu-item',
            show: false,
            onClick: function () {
              let data = self.WCMData
              self.tabs.addTab({select: false, url: data.srcURL})
            }
          },
          {
            title: 'Save image as',
            type: 'menu-item',
            show: false
          },
          {
            title: 'Copy image',
            type: 'menu-item',
            show: false,
            onClick: function () {
              let data = self.WCMData
              clipboard.clear()
              let img = nativeImage.createFromDataURL(data.srcURL)
              clipboard.writeImage(img)
            }
          },
          {
            title: 'Copy image address',
            type: 'menu-item',
            show: false,
            onClick: function () {
              let data = self.WCMData
              clipboard.clear()
              clipboard.writeText(data.srcURL)
            }
          },
          {
            type: 'separator',
            show: false
          },
          {
            title: 'Print',
            type: 'menu-item',
            show: false
          },
          {
            title: 'Save as',
            type: 'menu-item',
            show: false
          },
          {
            type: 'separator',
            show: false
          },
          {
            title: 'View source',
            type: 'menu-item',
            show: false
          },
          {
            title: 'Inspect element',
            type: 'menu-item',
            show: true,
            onClick: function () {
              let data = self.WCMData
              self.getSelectedPage().webview.inspectElement(data.x, data.y)
            }
          }
        ]
      }
    )

    this.tabMenu.setState(
      {
        menuItems: [
          {
            title: 'Add new tab',
            type: 'menu-item'
          },
          {
            type: 'separator'
          },
          {
            title: 'Pin tab',
            type: 'menu-item'
          },
          {
            title: 'Mute tab',
            type: 'menu-item'
          },
          {
            title: 'Duplicate',
            type: 'menu-item'
          },
          {
            type: 'separator'
          },
          {
            title: 'Close tab',
            type: 'menu-item'
          },
          {
            title: 'Close other tabs',
            type: 'menu-item'
          },
          {
            title: 'Close tabs from left',
            type: 'menu-item'
          },
          {
            title: 'Close tabs from right',
            type: 'menu-item'
          },
          {
            title: 'Revert closed tab',
            type: 'menu-item'
          }
        ]
      }
    )
  }

  /**
   * Sets bar text.
   * @param {string} text
   * @param {boolean} overrideActive
   */
  updateBarText = (text, overrideActive = false) => {
    const bar = this.bar
    let contains = false
    // Check if the url from webview is in excluded URLs.
    for (var i = 0; i < global.excludedURLs.length; i++) {
      if (global.excludedURLs[i].indexOf(text) !== -1) {
        contains = true
        break
      }
      if (text.indexOf(global.excludedURLs[i]) !== -1) {
        contains = true
        break
      }
    }
    // check if webview's url is in excluded urls
    if (!contains) {
      // if not, set bar's text to webview's url and unlock bar
      bar.setText(text, overrideActive)
      bar.locked = false
      bar.tempLocked = false
    } else {
      bar.setText('', overrideActive)
      // if it is, check if the url is wexond://newtab
      if (text.startsWith('wexond://newtab')) {
        // if it is, lock and show bar
        bar.locked = true
        bar.show()
      }
    }
  }

  /**
   * Gets this {App}.
   * @return {App}
   */
  getApp = () => {
    return this
  }

  /**
   * Gets selected page.
   * @return {Page}
   */
  getSelectedPage = () => {
    for (var i = 0; i < global.pages.length; i++) {
      if (global.pages[i].props.getTab().selected) {
        return global.pages[i]
      }
    }
    return null
  }


  render () {
    const self = this

    return (
      <div>
        <Tabs ref={(r) => { this.tabs = r }} getApp={this.getApp} />
        <Bar ref={(r) => { this.bar = r }} getApp={this.getApp} />
        {this.state.pagesToCreate.map((data, key) => {
          return (
            <Page getApp={this.getApp} getTab={data.getTab} url={data.url} key={key} />
          )
        })}
        <ContextMenu getApp={this.getApp} ref={(r) => { this.webviewMenu = r }} />
        <ContextMenu getApp={this.getApp} ref={(r) => { this.tabMenu = r }} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
