import React from 'react'

export default class Controls extends React.Component {
  /**
   * Closes window.
   */
  close = () => {
    global.currentWindow.close()
  }

  /**
   * Maximizes or restores window.
   */
  maximize = () => {
    if (global.currentWindow.isMaximized()) {
      // restore window
      global.currentWindow.unmaximize()
    } else {
      // maximize window
      global.currentWindow.maximize()
    }
  }

  /**
   * Minimizes window.
   */
  minimize = () => {
    global.currentWindow.minimize()
  }

  render () {
    return (
      <div className='controls'>
        <div className='control-close' onClick={() => { this.close() }} />
        <div className='control-maximize' onClick={() => { this.maximize() }} />
        <div className='control-minimize' onClick={() => { this.minimize() }} />
        <div className='control-separator' />
        <div className='control-menu' />
      </div>
    )
  }
}
