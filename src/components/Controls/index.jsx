import Component from 'inferno-component'

import { close, minimize, maximize } from '../../actions/window'

import Store from '../../store'
import { connect } from 'inferno-mobx'

@connect
export default class Controls extends Component {
  render () {
    return (
      <div className={'controls ' + Store.foreground}>
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