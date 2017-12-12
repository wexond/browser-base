import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

import TabGroupItem from '../TabGroupItem'

import { addTabGroup } from '../../actions/tabs'

@observer
export default class TabGroupsDialog extends Component {
  render () {
    const onClick = () => {
      addTabGroup()
    }

    return (
      <div className='tab-groups-dialog'>
        <div className='title'>
          Tab groups
        </div>
        <div className='content'>
          {Store.tabGroups.map((tabGroup, key) => {
            return <TabGroupItem tabGroup={tabGroup} key={key}></TabGroupItem>
          })}
          <div onClick={onClick}>Add</div>
        </div>
      </div>
    )
  }
}
