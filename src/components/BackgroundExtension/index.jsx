import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../stores/store'

import ipcMessages from '../../defaults/ipc-messages'

@observer
export default class BackgroundExtensions extends React.Component {
  componentDidMount () {
    this.props.data.backgroundExtension = this

    this.webview.addEventListener('dom-ready', (e) => {
      this.webview.openDevTools()
    })

    this.webview.addEventListener('ipc-message', (e) => {
      if (e.channel === ipcMessages.EXTENSION_RELOAD) {
        this.webview.reload()
      }
    })
  }

  render () {
    const {
      data
    } = this.props

    const url = 'file:///' + data.background.page

    return (
      <div className='background-extension'>
        <webview ref={(r) => { this.webview = r }} src={url} preload='../../src/preloads/extensions.js' />
      </div>
    )
  }
}