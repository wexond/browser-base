import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../stores/store'

@observer
export default class BackgroundExtensions extends React.Component {
  componentDidMount () {

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