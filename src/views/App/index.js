import React from 'react'
import ReactDOM from 'react-dom'
import Tabs from '../../components/Tabs'
import Bar from '../../components/Bar'
import Page from '../../components/Page'
import ContextMenu from '../../components/ContextMenu'
import MenuItem from '../../components/MenuItem'

import '../../helpers/Arrays'

import '../../app.scss'

const remote = require('electron').remote
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

window.global = {
  currentWindow: remote.getCurrentWindow(),
  remote: remote,
  tabs: [],
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

  render () {
    return (
      <div>
        <Tabs ref={(r) => { this.tabs = r }} getApp={this.getApp} />
        <Bar ref={(r) => { this.bar = r }} getApp={this.getApp} />
        {this.state.pagesToCreate.map((data, key) => {
          return (
            <Page getApp={this.getApp} getTab={data.getTab} url={data.url} key={key} />
          )
        })}
        <ContextMenu getApp={this.getApp} ref={(r) => { this.webviewMenu = r }}>
          <MenuItem>
            Open link in new tab
          </MenuItem>
          <div className='menu-separator' />
          <MenuItem>
            Copy link address
          </MenuItem>
          <MenuItem>
            Save link as
          </MenuItem>
          <div className='menu-separator' />
          <MenuItem>
            Open image in new tab
          </MenuItem>
          <MenuItem>
            Save image as
          </MenuItem>
          <MenuItem>
            Copy image
          </MenuItem>
          <MenuItem>
            Copy image address
          </MenuItem>
          <div className='menu-separator' />
          <MenuItem>
            Print
          </MenuItem>
          <MenuItem>
            View source
          </MenuItem>
          <MenuItem>
            Inspect element
          </MenuItem>
        </ContextMenu>

        <ContextMenu getApp={this.getApp} ref={(r) => { this.tabMenu = r }}>
          <MenuItem>
            Add new tab
          </MenuItem>
          <div className='menu-separator' />
          <MenuItem>
            Pin tab
          </MenuItem>
          <MenuItem>
            Mute tab
          </MenuItem>
          <MenuItem>
            Duplicate
          </MenuItem>
          <div className='menu-separator' />
          <MenuItem>
            Close tab
          </MenuItem>
          <MenuItem>
            Close other tabs
          </MenuItem>
          <MenuItem>
            Close tabs from left
          </MenuItem>
          <MenuItem>
            Close tabs from right
          </MenuItem>
          <div className='menu-separator' />
          <MenuItem>
            Revert closed tab
          </MenuItem>
        </ContextMenu>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
