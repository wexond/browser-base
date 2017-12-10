import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

import { getSelectedPage } from '../../actions/pages'

@observer
export default class Suggestion extends Component {
  render () {
    let dashDisplay = 'block'
    let titleContent = this.props.title
    let urlContent = this.props.url
    if (this.props.title == null) {
      titleContent = this.props.url
      urlContent = ''
      dashDisplay = 'none'
    }

    const onClick = (e) => {
      const page = getSelectedPage()
      if (this.props.title == null) {
        page.page.webview.loadURL('https://www.google.com/search?q=' + this.props.url)
      } else {
        page.page.webview.loadURL(this.props.url)
      }
      this.props.hide()
      Store.app.bar.addressBar.setInputToggled(false, true)
    }

    return (
      <div onClick={onClick} className={'suggestion ' + ((this.props.selected) ? 'selected' : '')}>
        <div className='container'>
          <div className='favicon'>

          </div>
          <div className='title'>
            {titleContent}
          </div>
          <div className='dash' style={{display: dashDisplay}}>
            &mdash;
          </div>
          <div className='address'>
            {urlContent}
          </div>
        </div>
      </div>
    )
  }
}
