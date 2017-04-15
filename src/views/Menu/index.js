import React from 'react'
import ReactDOM from 'react-dom'
import Spring from '../../helpers/Spring'
import {spring, Motion} from 'react-motion'

import '../../menu.scss'

const electron = require('electron')
const remote = electron.remote

window.global = {
  currentWindow: remote.getCurrentWindow(),
  remote: remote,
  ipcRenderer: electron.ipcRenderer,
  menuAnimationData: {
    opacitySpring: Spring.durationToSpring(0.4),
    topSpring: Spring.durationToSpring(0.4)
  }
}

class Menu extends React.Component {
  constructor () {
    super()

    this.state = {
      opacity: 0,
      top: 0
    }
  }

  componentDidMount () {
    const self = this

    /** Events */

    /** Communicate with Menu and App. */

    global.ipcRenderer.on('menu:show', function (e, mouseX, mouseY) {
      self.mouseX = mouseX
      self.mouseY = mouseY

      self.setPosition()

      self.show()
    })

    global.ipcRenderer.on('menu:hide', function () {
      self.hide()
    })

    window.addEventListener('click', function () {
      self.hide()
    })
  }

  /**
   * Shows the menu.
   * Animates opacity and top property of menu, and turns off ignoring mouse events.
   */
  show = () => {
    global.currentWindow.setIgnoreMouseEvents(false)
    global.currentWindow.focus()
    this.setState({
      opacity: spring(1, global.menuAnimationData.opacitySpring),
      top: spring(40, global.menuAnimationData.topSpring)
    })
  }

  /**
   * Hides the menu.
   * Animates opacity and top property of menu, and turns on ignoring mouse events.
   */
  hide = () => {
    this.setState({
      opacity: spring(0, global.menuAnimationData.opacitySpring),
      top: spring(0, global.menuAnimationData.topSpring)
    })
    remote.getCurrentWindow().setIgnoreMouseEvents(true)
  }

  /**
   * Sets position of menu under cursor or above the cursor.
   */
  setPosition = () => {
    var screenHeight = window.screen.availHeight
    var screenWidth = window.screen.availWidth
    var height = this.menu.offsetHeight
    var x = this.mouseX - 12
    var y = this.mouseY - 55

    if (this.mouseX + this.menu.offsetWidth >= screenWidth) {
      x = this.mouseX - this.menu.offsetWidth - 14
    }

    if (this.mouseY + height >= screenHeight) {
      y = this.mouseY - height - 55
    }

    remote.getCurrentWindow().setPosition(x, y)

    this.fixPosition(height)
  }

  /**
   * Fixes menu position when it's out of screen.
   * @param {number} height - the height of menu
   */
  fixPosition = (height) => {
    var y = global.currentWindow.getPosition()[1]
    var x = global.currentWindow.getPosition()[0]
    var yFromDown = y + height
    var screenHeight = window.screen.availHeight

    if (y < 0) {
      global.currentWindow.setPosition(x, 32)
    }

    if (yFromDown > screenHeight) {
      global.currentWindow.setPosition(x, screenHeight - height - 80)
    }
  }

  render () {
    /** Events */

    function onClick (e) {
      e.stopPropagation()
    }

    return (
      <Motion style={{opacity: this.state.opacity, top: this.state.top}}>
        {value =>
          <div ref={(t) => { this.menu = t }} className='menu' onClick={onClick} style={{opacity: value.opacity, top: value.top}}>
            <div className='menu-actions'>
              <div className='menu-action-back' />
              <div className='menu-action-forward' />
              <div className='menu-action-reload' />
              <div className='menu-action-star' />
              <div className='menu-action-expand' />
            </div>
          </div>}

      </Motion>
    )
  }
}

ReactDOM.render(
  <Menu />, document.getElementById('app'))
