import Component from 'inferno-component'

import { close, minimize, maximize } from '../../actions/window'

export default class Controls extends Component {
  render () {
    return (
      <div className='controls'>
        <div className='close' onClick={close}>
          <div className='icon' />
        </div>
        <div className='maximize' onClick={maximize}>
          <div className='icon' />
        </div>
        <div className='minimize' onClick={minimize}>
          <div className='icon' />
        </div>
      </div>
    )
  }
}