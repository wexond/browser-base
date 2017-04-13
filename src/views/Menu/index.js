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

    global.ipcRenderer.on('menu:show', function (e, mouseX, mouseY) {
      self.mouseX = mouseX
      self.mouseY = mouseY

      //self.setPosition()
      self.show()
    })

    global.ipcRenderer.on('menu:hide', function () {
      self.hide()
    })

    window.addEventListener('click', function () {
      self.hide()
    })
  }

  show = () => {
    global.currentWindow.setIgnoreMouseEvents(false)
    global.currentWindow.focus()
    this.setState({
      opacity: spring(1, global.menuAnimationData.opacitySpring),
      top: spring(40, global.menuAnimationData.topSpring)
    })
  }

  hide = () => {
    this.setState({
      opacity: spring(0, global.menuAnimationData.opacitySpring),
      top: spring(0, global.menuAnimationData.topSpring)
    })
    remote.getCurrentWindow().setIgnoreMouseEvents(true)
  }

  render () {
    /** Events */

    function onClick (e) {
      e.stopPropagation()
    }

    return (
      <Motion style={{opacity: this.state.opacity, top: this.state.top}}>
        {value =>
          <div className='menu' onClick={onClick} style={{opacity: value.opacity, top: value.top}}>
            Hello
          </div>}

      </Motion>
    )
  }
}

ReactDOM.render(
  <Menu />, document.getElementById('app'))
