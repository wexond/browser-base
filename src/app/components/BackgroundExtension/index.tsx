import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import ipcMessages from '../../defaults/ipc-messages'

interface Props {
  data: any
}

interface State {

}

@observer
export default class BackgroundExtensions extends React.Component<Props, State> {

  public webview: HTMLWebViewElement

  public componentDidMount() {
    this.props.data.backgroundExtension = this

    this.webview.addEventListener('ipc-message', (e: any) => {
      if (e.channel === ipcMessages.EXTENSION_RELOAD) {
        this.webview.reload()
      }
    })
  }

  public render(): JSX.Element {
    const {
      data
    } = this.props

    const url = 'file:///' + data.background.page

    return (
      <div className='background-extension'>
        <webview ref={ (r) => { this.webview = r } } src={ url } preload='../../src/preloads/extensions.js' />
      </div>
    )
  }
}