import React from 'react'
import WebView from './components/WebView'

export default class Page extends React.Component {
  constructor () {
    super()

    this.state = {
      visible: false,
      render: true
    }
  }

  render () {
    var pageStyle = {
      opacity: (this.state.visible) ? 1 : 0,
      position: (this.state.visible) ? 'relative' : 'absolute',
      top: (this.state.visible) ? 0 : -window.innerHeight - 50
    }

    if (this.state.render) {
      return (
        <div style={pageStyle} className='page'>
          <WebView getTab={this.props.getTab} src={this.props.url} />
        </div>
      )
    } else {
      return null
    }
  }
}
