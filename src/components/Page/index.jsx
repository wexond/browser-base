import Component from 'inferno-component'

import { connect } from 'inferno-mobx'
import Store from '../../store'

@connect
export default class Page extends Component {
  render () {
    const tab = this.props.data
    const isSelected = Store.selectedTab === Store.tabs.indexOf(tab)

    const pageClass = (isSelected) ? '' : 'hide'

    const {
      url
    } = this.props.data

    return (
      <div className={'page ' + pageClass}>
        <webview className={'webview ' + pageClass} src={url}></webview>
      </div>
    )
  }
}
