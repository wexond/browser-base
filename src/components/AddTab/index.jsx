import Component from 'inferno-component'

import { defaultOptions } from '../../defaults/tabs'

import { addTab } from '../../actions/tabs'

import Store from '../../store'
import { connect } from 'inferno-mobx'

@connect
export default class AddTab extends Component {
  getWidth () {
    return this.addTab.offsetWidth
  }

  render () {
    const addTabStyle = {
      left: Store.addTabLeft
    }

    const onClick = e => {
      e.stopPropagation()
      addTab(defaultOptions)
    }

    return (
      <div className='add-tab' onClick={onClick} ref={(a) => { this.addTab = a }} style={addTabStyle}>
      </div>
    )
  }
}