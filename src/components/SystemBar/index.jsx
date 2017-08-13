import Component from 'inferno-component'

import Controls from '../Controls'

export default class SystemBar extends Component {
  render () {
    return (
      <div className='system-bar'>
        {this.props.children}
        <Controls />
        <div className='border-bottom' />
      </div>
    )
  }
}
