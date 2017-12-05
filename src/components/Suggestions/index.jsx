import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

import Suggestion from '../Suggestion'

@observer
export default class Suggestions extends Component {
  render () {
    return (
      <div className='suggestions'>
        <Suggestion />
      </div>
    )
  }
}
