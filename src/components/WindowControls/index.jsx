import Component from '../../component'

import { close, maximize, minimize } from '../../actions/window'

export default class WindowControls extends Component {
  render () {
    return (
      <div className='window-controls'>
        <div ref='close' onClick={close} className='window-control-close' />
        <div ref='maximize' onClick={maximize} className='window-control-maximize' />
        <div ref='minimize' onClick={minimize} className='window-control-minimize' />
      </div>
    )
  }
}