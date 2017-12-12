import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

import { switchTabGroup } from '../../actions/tabs'

@observer
export default class TabGroupItem extends Component {
  render () {
    const onClick = (e) => {
      switchTabGroup(this.props.tabGroup.id)
    }

    return (
      <div className='tab-group-item' onClick={onClick}>
        {this.props.tabGroup.title}
      </div>
    )
  }
}
