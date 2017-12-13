import React from 'react'

import { observer } from 'mobx-react'

import Store from '../../store'

import MenuItem from '../MenuItem'

import { switchTabGroup, removeTabGroup, getTabGroupById } from '../../actions/tabs'

@observer
export default class TabGroupsMenuItem extends React.Component {
  render () {
    const tabGroup = this.props.tabGroup

    let selected = tabGroup.id === Store.currentTabGroup

    let editing = tabGroup.id === Store.editingTabGroup

    const onClick = () => {
      Store.editingTabGroup = -1
      Store.app.tabGroupsMenu.hide()
      switchTabGroup(tabGroup.id)
    }

    const onRemoveClick = (e) => {
      e.stopPropagation()
      removeTabGroup(getTabGroupById(tabGroup.id))
      Store.app.tabGroupsMenu.refreshHeight()
      Store.editingTabGroup = -1
    }

    const onEditClick = (e) => {
      e.stopPropagation()
      switchTabGroup(tabGroup.id)
      Store.app.tabGroupsMenu.refreshHeight()
      Store.editingTabGroup = (editing) ? -1 : tabGroup.id
    }

    const onInput = (e) => {
      tabGroup.title = e.currentTarget.value
    }

    const onInputKeyPress = (e) => {
      if (e.keyCode === 13) { // Enter
        input.style.display = 'none'
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
          <input style={inputStyle} {...inputEvents} defaultValue={tabGroup.title}></input>
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