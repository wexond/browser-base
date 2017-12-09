import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

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

    return (
      <div className='suggestion'>
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
