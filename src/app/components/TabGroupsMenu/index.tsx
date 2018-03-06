import React from 'react'

import { observer } from 'mobx-react'

import Store from '../../store'

import * as tabGroupsActions from '../../actions/tab-groups'

import FlatButton from '../../../Material/FlatButton'
import TabGroupsMenuItem from '../TabGroupsMenuItem'

interface Props {

}

interface State {
  
}

@observer
export default class TabGroupsMenu extends React.Component {
  public render (): JSX.Element {
    const onAddClick = () => {
      tabGroupsActions.addTabGroup()
      Store.app.tabGroupsMenu.refreshHeight()
      Store.editingTabGroup = -1
    }

    return (
      <div className='tab-groups-menu'>
        <div className='menu-items'>
          {Store.tabGroups.map((item, key) => {
            return <TabGroupsMenuItem tabGroup={item} key={key}></TabGroupsMenuItem>
          })}
        </div>
        <FlatButton className='add-group' onClick={onAddClick}>
          {Store.dictionary.tabGroups.addNewGroup}
        </FlatButton>
        <div style={{clear: 'both'}}></div>
      </div>
    )
  }
}