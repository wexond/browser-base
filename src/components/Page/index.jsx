import Component from 'inferno-component'

import { connect } from 'inferno-mobx'
import Store from '../../store'

@connect
export default class Page extends Component {
  componentDidMount () {
    const tab = this.props.tab
    const page = this.props.page

    page.webview = this.webview

    this.webview.addEventListener('did-stop-loading', (e) => {
      tab.url = this.webview.getURL()

      Store.app.bar.setInfo(tab.url)

      Store.app.bar.setInputToggled(false);
    })
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
