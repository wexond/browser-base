import Component from 'inferno-component'

import AddressBar from '../AddressBar'

import { getSelectedPage } from '../../actions/tabs'

export default class Bar extends Component {
  constructor () {
    super()

    this.state = {
      canGoBack: false,
      canGoForward: false
    }
  }

  componentDidMount () {
    this.focus = this.addressBar.focus
    this.setURL = this.addressBar.setURL
    this.setInfo = this.addressBar.setInfo
    this.setInputToggled = this.addressBar.setInputToggled
  }

  refreshIconsState () {
    const page = getSelectedPage()

    if (page != null && page.page != null && page.page.webview.getWebContents() != null) {
      this.setState({
        canGoBack: page.page.webview.canGoBack(),
        canGoForward: page.page.webview.canGoForward()
      })
    }
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
        <div className={'bar-icon back ' + ((!canGoBack) ? 'disabled' : '')} onClick={onBackClick} />
        <div className={'bar-icon forward ' + ((!canGoForward) ? 'disabled' : '')} onClick={onForwardClick} />
        <div className='bar-icon refresh' onClick={onRefreshClick} />
        <AddressBar ref={(r) => { this.addressBar = r }} />
        <div className='bar-icon menu' />
      </div>
    )
  }
}