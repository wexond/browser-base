import React from 'react'
import ReactDOM from 'react-dom'
import Tabs from './components/Tabs'
import Spring from '../../helpers/Spring'
import '../../helpers/Arrays'

import '../../app.scss'

const {remote} = require('electron')

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
    closeTabSpring: Spring.durationToSpring(0.4),
    setPositionsSpring: Spring.durationToSpring(0.4),
    setWidthsSpring: Spring.durationToSpring(0.4)
  },
  defaultOptions: {
    select: true,
    url: 'wexond://newtab'
  },
  excludedURLs: ['wexond://newtab', 'wexond://newtab/']
}

class App extends React.Component {
  componentDidMount () {
    window.addEventListener('contextmenu', function (e) {
      if (e.target.tagName === 'WEBVIEW') {
        global.menuWindow.send('menu:show', e.screenX, e.screenY)
      }
    })
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

  render () {
    return (
      <div>
        <Tabs ref='tabs' getApp={this.getApp} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
