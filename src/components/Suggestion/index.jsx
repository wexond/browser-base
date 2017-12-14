import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import * as pagesActions from '../../actions/pages'

@observer
export default class Suggestion extends React.Component {
  render () {
    let description = this.props.url
    if (this.props.description != null) description = this.props.description

    const onClick = (e) => {
      const page = getSelectedPage()
      if (this.props.type === 'search') {
        page.page.webview.loadURL('https://www.google.com/search?q=' + this.props.title)
      } else if (this.props.type === 'history') {
        page.page.webview.loadURL(this.props.url)
      } else if (this.props.type === 'first-url') {
        page.page.webview.loadURL(this.props.title)
      } else if (this.props.type === 'first-search') {
        page.page.webview.loadURL('https://www.google.com/search?q=' + this.props.title)
      }

      this.props.hide()
      Store.app.bar.addressBar.setInputToggled(false, true)
    }

    let dashDisplay = 'block'
    
    if (this.props.url == null && this.props.description == null) {
      dashDisplay = 'none'
    }

    return (
      <div onClick={onClick} className={'suggestion ' + ((this.props.selected) ? 'selected' : '')}>
        <div className='container'>
          <div className='favicon'>

          </div>
          <div className='title'>
            {this.props.title}
          </div>
          <div className='dash' style={{display: dashDisplay}}>
            &mdash;
          </div>
          <div className='address'>
            {description}
          </div>
        </div>
      </div>
    )
  }
}