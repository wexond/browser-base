import Component from 'inferno-component'

import AddressBar from '../AddressBar'

import { getNavigationState, getSelectedPage } from '../../actions/pages'

export default class Bar extends Component {
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
      <div className='bar'>
        <div className={'bar-icon back-icon ' + ((!canGoBack) ? 'disabled' : '')} onClick={onBackClick} />
        <div className={'bar-icon forward-icon ' + ((!canGoForward) ? 'disabled' : '')} onClick={onForwardClick} />
        <div className='bar-icon refresh-icon' onClick={onRefreshClick} />
        <AddressBar ref={(r) => { this.addressBar = r }} />
        <div className='bar-icon menu-icon' />
      </div>
    )
  }
}