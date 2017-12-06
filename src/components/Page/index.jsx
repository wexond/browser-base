import Component from 'inferno-component'

import { connect } from 'inferno-mobx'
import Store from '../../store'

@connect
export default class Page extends Component {
  componentDidMount () {
    const tab = this.props.tab
    const page = this.props.page

    page.page = this

    page.webview = this.webview

    this.webview.addEventListener('did-stop-loading', (e) => {
      Store.app.bar.refreshIconsState()
    })

    const didNavigate = (e) => {
      tab.url = e.url
      Store.url = e.url
      Store.app.bar.setInfo(e.url)
      Store.app.bar.setInputToggled(false)
    }

    this.webview.addEventListener('did-navigate', didNavigate)
    this.webview.addEventListener('did-navigate-in-page', didNavigate)

    this.webview.addEventListener('will-navigate', (e) => {
      tab.url = e.url
      Store.url = e.url
      Store.app.bar.setInfo(tab.url)
    })
  }

  goBack () {
    this.webview.goBack()
    Store.app.bar.refreshIconsState()
  }

  goForward () {
    this.webview.goForward()
    Store.app.bar.refreshIconsState()
  }

  refresh () {
    this.webview.reload()
    Store.app.bar.refreshIconsState()
  }

  render () {
    const tab = this.props.tab
    const page = this.props.page
    const isSelected = Store.selectedTab === tab.id

    const {
      url
    } = this.props.page

    const pageClass = (isSelected) ? '' : 'hide'

    return (
      <div className={'page ' + pageClass}>
        <webview ref={(r) => { this.webview = r }} className={'webview ' + pageClass} src={url}></webview>
      </div>
    )
  }
}
