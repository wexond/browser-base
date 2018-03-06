import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import * as pagesActions from '../../actions/pages'

import Ripple from '../../../Material/Ripple'

interface Props {

}

interface State {
  canGoBack: boolean,
  canGoForward: boolean,
}

@observer
export default class MenuNavigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      canGoBack: false,
      canGoForward: false
    }
  }

  public refreshIconsState() {
    this.setState(pagesActions.getNavigationState())
  }

  public render(): JSX.Element {
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
        <div className={ 'icon back-icon ' + ((!canGoBack) ? 'disabled' : '') } onClick={ onBackClick }>
          <Ripple center />
        </div>
        <div className={ 'icon forward-icon ' + ((!canGoForward) ? 'disabled' : '') } onClick={ onForwardClick }>
          <Ripple center />
        </div>
        <div className='icon refresh-icon' onClick={ onRefreshClick }>
          <Ripple center />
        </div>
        <div className='icon favorite-icon' onClick={ onFavoriteClick }>
          <Ripple center />
        </div>
      </div>
    )
  }
}
