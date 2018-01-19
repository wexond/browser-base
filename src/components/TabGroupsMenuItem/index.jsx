import React from 'react'

import { observer } from 'mobx-react'

import Store from '../../stores/store'

import MenuItem from '../MenuItem'
import Input from '../Input'

import * as tabGroupsActions from '../../actions/tab-groups'

@observer
export default class TabGroupsMenuItem extends React.Component {
  render () {
    const tabGroup = this.props.tabGroup

    let selected = tabGroup.id === Store.currentTabGroup

    let editing = tabGroup.id === Store.editingTabGroup

    const onClick = () => {
      Store.editingTabGroup = -1
      Store.app.tabGroupsMenu.hide()
      tabGroupsActions.switchTabGroup(tabGroup.id)
    }

    const onRemoveClick = (e) => {
      e.stopPropagation()
      tabGroupsActions.removeTabGroup(tabGroupsActions.getTabGroupById(tabGroup.id))
      Store.app.tabGroupsMenu.refreshHeight()
      Store.editingTabGroup = -1
    }

    const onEditClick = (e) => {
      e.stopPropagation()
      this.input.focus()
      tabGroupsActions.switchTabGroup(tabGroup.id)
      Store.app.tabGroupsMenu.refreshHeight()
      Store.editingTabGroup = (editing) ? -1 : tabGroup.id
    }

    const onInput = (e) => {
      tabGroup.title = e.currentTarget.value
    }

    const onInputKeyPress = (e) => {
      if (e.which === 13) { // Enter
        Store.editingTabGroup = -1
      }
    }

    const onInputClick = (e) => {
      e.stopPropagation()
    }

    const inputEvents = {
      onClick: onInputClick,
      onKeyPress: onInputKeyPress,
      onInput: onInput
    }

    const inputStyle = {
      display: (editing) ? 'block' : 'none'
    }

    const titleStyle = {
      display: (!editing) ? 'block' : 'none'
    }

    return (
      <div className={'tab-groups-menu-item ' + ((editing) ? 'editing' : '')} onClick={onClick}>
        <div className={'content ' + ((selected) ? 'selected ' : ' ')}>
          <Input ref={(r) => { this.input = r }} className='input1' style={inputStyle} {...inputEvents} defaultValue={tabGroup.title}></Input>
          <div className='title' style={titleStyle} >
            {tabGroup.title}
          </div>
          <div className='icon remove-icon' onClick={onRemoveClick}></div>
          <div className='icon edit-icon' onClick={onEditClick}></div>
        </div>
      </div>
    )
  }
}