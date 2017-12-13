import React from 'react'

import { observer } from 'mobx-react'

import Store from '../../store'

import MenuItem from '../MenuItem'

import { switchTabGroup, addTabGroup } from '../../actions/tabs'

@observer
export default class TabGroupsMenu extends React.Component {
  render () {
    const onAddClick = () => {
      addTabGroup()
      Store.app.tabGroupsMenu.refreshHeight()
    }

    return (
      <div className='tab-groups-menu'>
        {Store.tabGroups.map((item, key) => {
          const onClick = () => {
            Store.app.tabGroupsMenu.hide()

            switchTabGroup(item.id)
          }

          let selected = item.id === Store.currentTabGroup

          return <MenuItem selected={selected} key={key} onClick={onClick}>{item.title}</MenuItem>
        })}
        <div className='add-group' onClick={onAddClick}>Add new group</div>
        <div style={{clear: 'both'}}></div>
      </div>
    )
  }
}