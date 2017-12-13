import React from 'react'

import { close, minimize, maximize } from '../../actions/window'

import Store from '../../store'
import { observer } from 'mobx-react'

@observer
export default class Controls extends React.Component {
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