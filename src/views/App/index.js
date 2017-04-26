import React from 'react'
import ReactDOM from 'react-dom'
import Tabs from './components/Tabs'
import Spring from '../../helpers/Spring'
import Bar from './components/Bar'
import Page from './components/Page'

import './../../helpers/Arrays'

import './../../app.scss'

const remote  = require('electron').remote
const fs      = require('fs')
const path    = require('path')
const homedir = require('os').homedir()

const userData = path.join(homedir, '.wexond')

window.global = {
  currentWindow: remote.getCurrentWindow(),
  menuWindow: remote.getCurrentWindow().getChildWindows()[0],
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
  excludedURLs: ['wexond://newtab', 'wexond://newtab/'],
  historyPath: path.join(userData, 'history.json'),
  systembarHeight: 32
}

// In here declare default files that should
// be created on first initialization or when the user breaks them
// For example:
// {
//   path: 'user/settings.json',
//   defaultContent: '{ foo: 'bar' }'
// }

const neededFiles = [
  {
    path: 'history.json',
    defaultContent: '[]'
  }
]

for (var i = 0; i < neededFiles.length; i++) {
  let file = path.join(userData, neededFiles[i].path)

  if(!fs.existsSync(file)) {
    fs.writeFile(file, neededFiles[i].defaultContent, function(err) {
      if(err) console.error(err)
    })
  }
}

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      pagesToCreate: []
    }
  }

  componentDidMount () {
    window.addEventListener('contextmenu', function (e) {
      if (e.target.tagName === 'WEBVIEW') {
        global.menuWindow.send('menu:show', e.screenX, e.screenY)
      }
    })
  }

  /**
   * Sets bar text.
   * @param {string} text
   * @param {boolean} overrideActive
   */
  updateBarText = (text, overrideActive) => {
    const bar = this.getBar()
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
   * Gets Systembar.
   * @return {Systembar}
   */
  getTabs = () => {
    return this.refs.tabs
  }

  /**
   * Gets Bar.
   * @return {Bar}
   */
  getBar = () => {
    return this.refs.bar
  }

  render () {
    return (
      <div>
        <Tabs ref='tabs' getApp={this.getApp} />
        <Bar ref='bar' getApp={this.getApp} />
        {this.state.pagesToCreate.map((data, key) => {
          return (
            <Page getApp={this.getApp} getTab={data.getTab} url={data.url} key={key} />
          )
        })}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
