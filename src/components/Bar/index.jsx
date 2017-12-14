import React from 'react'

import AddressBar from '../AddressBar'

import * as pagesActions from '../../actions/pages'
import * as tabsActions from '../../actions/tabs'

import { observer } from 'mobx-react'
import Store from '../../store'

import Colors from '../../utils/colors'

@observer
export default class Bar extends React.Component {
  constructor () {
    super()

    this.state = {
      canGoBack: false,
      canGoForward: false
    }
  }

  refreshIconsState () {
    this.setState(pagesActions.getNavigationState())
  }

  render () {
    const {
      canGoBack,
      canGoForward
    } = this.state

    const onBackClick = () => {
      const page = pagesActions.getSelectedPage()
      page.page.goBack()
    }

    const onForwardClick = () => {
      const page = pagesActions.getSelectedPage()
      page.page.goForward()
    }

    const onRefreshClick = () => {
      const page = pagesActions.getSelectedPage()
      page.page.refresh()
    }

    const barStyle = {
      backgroundColor: Store.backgroundColor,
      display: (Store.isFullscreen) ? 'none' : 'flex'
    }

    return (
      <div className={'bar ' + Store.foreground} style={barStyle}>
        <div className={'bar-icon back-icon ' + ((!canGoBack) ? 'disabled' : '')} onClick={onBackClick} />
        <div className={'bar-icon forward-icon ' + ((!canGoForward) ? 'disabled' : '')} onClick={onForwardClick} />
        <div className='bar-icon refresh-icon' onClick={onRefreshClick} />
        <AddressBar ref={(r) => { this.addressBar = r }} />
        <div className='bar-icon menu-icon' />
      </div>
    )
  }
}