import Component from 'inferno-component'

import { connect } from 'inferno-mobx'
import Store from '../../store'

@connect
export default class Page extends Component {
  render () {
    const tab = this.props.data
    const isSelected = Store.selectedTab === Store.tabs.indexOf(tab)

    const {
      url,
      renderPage
    } = this.props.data

    if (!renderPage) return null

    const pageClass = (isSelected) ? '' : 'hide'

    return (
      <div className={'page ' + pageClass}>
        <webview className={'webview ' + pageClass} src={url}></webview>
      </div>
    )
  }
}
