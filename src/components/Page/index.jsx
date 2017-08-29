import Component from 'inferno-component'

import { connect } from 'inferno-mobx'
import Store from '../../store'

@connect
export default class Page extends Component {
  render () {
    const tab = this.props.tab
    const page = this.props.page
    const isSelected = Store.selectedTab === tab.id

    const {
      url,
      renderPage
    } = page

    if (!renderPage) return null

    const pageClass = (isSelected) ? '' : 'hide'

    return (
      <div className={'page ' + pageClass}>
        <webview className={'webview ' + pageClass} src={url}></webview>
      </div>
    )
  }
}
