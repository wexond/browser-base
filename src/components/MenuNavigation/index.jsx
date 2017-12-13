import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import { getNavigationState, getSelectedPage } from '../../actions/pages'

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
    this.setState(getNavigationState())
  }

  render () {
    const {
      canGoBack,
      canGoForward
    } = this.state

    const onBackClick = () => {
      const page = getSelectedPage()
      page.page.goBack()
    }

    const onForwardClick = () => {
      const page = getSelectedPage()
      page.page.goForward()
    }

    const onRefreshClick = () => {
      const page = getSelectedPage()
      page.page.refresh()
    }

    return (
      <div className='menu-navigation'>
        <div className={'icon back-icon ' + ((!canGoBack) ? 'disabled' : '')} onClick={onBackClick}></div>
        <div className={'icon forward-icon ' + ((!canGoForward) ? 'disabled' : '')} onClick={onForwardClick}></div>
        <div className='icon refresh-icon' onClick={onRefreshClick}></div>
        <div className='icon favorite-icon'></div>
      </div>
    )
  }
}
