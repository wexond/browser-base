import React from 'react'

import ToolBar from '../ToolBar'
import Checkbox from '../Checkbox'

import Ripple from '../Ripple'

export default class Settings extends React.Component {
  render() {
    return (
      <div className='settings'>
        <ToolBar title='Settings' />
        <div className='content'>
          <div className='test'>
            <Ripple />
          </div>
        </div>
      </div>
    )
  }
}