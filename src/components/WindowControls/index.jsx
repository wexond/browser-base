import Component from '../../component'

import { close, maximize, minimize } from '../../actions/window'

export default class WindowControls extends Component {
  render () {
    return (
      <div className='controls' ref='controls'>
        <div ref='close' onClick={close} className='control control-close' />
        <div ref='maximize' onClick={maximize} className='control control-maximize' />
        <div ref='minimize' onClick={minimize} className='control control-minimize' />
      </div>
    )
  }
}