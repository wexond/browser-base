import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

@observer
export default class Suggestion extends Component {
  render () {
    return (
      <div className='suggestion'>
        <div className='container'>
          <div className='favicon'>

          </div>
          <div className='title'>
            {this.props.title}
          </div>
          <div className='dash'>
          &mdash;
          </div>
          <div className='address'>
            {this.props.url}
          </div>
        </div>
      </div>
    )
  }
}
