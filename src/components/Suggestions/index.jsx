import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

import Suggestion from '../Suggestion'

@observer
export default class Suggestions extends Component {
  constructor () {
    super()

    this.state = {
      visible: false
    }
  }

  hide () {
    this.setState({visible: false})
  }

  show () {
    this.setState({visible: true})
  }

  render () {
    const {
      visible
    } = this.state

    const suggestionsStyle = {
      display: (visible) ? 'flex' : 'none'
    }

    return (
      <div style={suggestionsStyle} className='suggestions'>
        <Suggestion />
      </div>
    )
  }
}
