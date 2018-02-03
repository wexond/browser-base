import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../../stores/store'

import * as pagesActions from '../../../actions/pages'

@observer
export default class MenuNavigation extends React.Component {
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
      Store.app.pageMenu.hide()
      Store.app.tabMenu.hide()
    }

    const onForwardClick = () => {
      const page = pagesActions.getSelectedPage()
      page.page.goForward()
      Store.app.pageMenu.hide()
      Store.app.tabMenu.hide()
    }

    const onRefreshClick = () => {
      const page = pagesActions.getSelectedPage()
      page.page.refresh()
      Store.app.pageMenu.hide()
      Store.app.tabMenu.hide()
    }

    const onFavoriteClick = () => {
      Store.app.pageMenu.hide()
      Store.app.tabMenu.hide()
    }

    return (
      <div className='menu-navigation'>
        <div className={'icon back-icon ' + ((!canGoBack) ? 'disabled' : '')} onClick={onBackClick}></div>
        <div className={'icon forward-icon ' + ((!canGoForward) ? 'disabled' : '')} onClick={onForwardClick}></div>
        <div className='icon refresh-icon' onClick={onRefreshClick}></div>
        <div className='icon favorite-icon' onClick={onFavoriteClick}></div>
      </div>
    )
  }
}
