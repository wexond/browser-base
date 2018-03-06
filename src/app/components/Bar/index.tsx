import React from 'react'

import Ripple from '../../../Material/Ripple'
import AddressBar from '../AddressBar'

import * as pagesActions from '../../actions/pages'
import * as tabsActions from '../../actions/tabs'

import { observer } from 'mobx-react'
import Store from '../../store'

import Colors from '../../utils/colors'

interface Props {

}

interface State {
  canGoBack: boolean,
  canGoForward: boolean,
}

@observer
export default class Bar extends React.Component<Props, State> {

  public addressBar: AddressBar

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

    const onBackClick = (): void => {
      const page = pagesActions.getSelectedPage()
      page.page.goBack()
    }

    const onForwardClick = (): void => {
      const page = pagesActions.getSelectedPage()
      page.page.goForward()
    }

    const onRefreshClick = (): void => {
      const page = pagesActions.getSelectedPage()
      page.page.refresh()
    }

    const onMenuClick = (): void => {
      Store.app.menu.show()
    }

    const barStyle = {
      backgroundColor: Store.backgroundColor,
      display: (Store.isFullscreen) ? 'none' : 'flex'
    }

    return (
      <div className={ 'bar ' + Store.foreground + (!Store.border ? ' disabled-border' : '') } style={ barStyle }>
        <div className={ 'bar-icon back-icon ' + ((!canGoBack) ? 'disabled' : '') } onClick={ onBackClick } >
          <Ripple center={ true } scale={ 12 } offsetX={ 15 } />
        </div>
        <div className={ 'bar-icon forward-icon ' + ((!canGoForward) ? 'disabled' : '') } onClick={ onForwardClick } >
          <Ripple center={ true } scale={ 12 } offsetX={ -5 } />
        </div>
        <div className='bar-icon refresh-icon' onClick={ onRefreshClick } >
          <Ripple center={ true } scale={ 12 } />
        </div>
        <AddressBar ref={ (r) => { this.addressBar = r } } />
        <div className='bar-icon menu-icon' onClick={ onMenuClick } >
          <Ripple center={ true } scale={ 12 } offsetX={ -5 } />
        </div>
      </div>
    )
  }
}