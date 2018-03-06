import React from 'react'

import { observer } from 'mobx-react'

import Store from '../../store'

import Input from '../../../Material/Input'
import Ripple from '../../../Material/Ripple'
import MenuItem from '../MenuItem'

import * as tabGroupsActions from '../../actions/tab-groups'
import TabGroup from '../TabGroup';

interface Props {
  tabGroup: TabGroup
}

interface State {

}

@observer
export default class TabGroupsMenuItem extends React.Component<Props, State> {
  
  public input: Input
  public render(): JSX.Element {
    const tabGroup = this.props.tabGroup

    const selected = tabGroup.id === Store.currentTabGroup

    const editing = tabGroup.id === Store.editingTabGroup

    const onClick = () => {
      Store.editingTabGroup = -1
      Store.app.tabGroupsMenu.hide()
      tabGroupsActions.switchTabGroup(tabGroup.id)
    }

    const onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      tabGroupsActions.removeTabGroup(tabGroupsActions.getTabGroupById(tabGroup.id))
      Store.app.tabGroupsMenu.refreshHeight()
      Store.editingTabGroup = -1
    }

    const onEditClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      this.input.focus()
      tabGroupsActions.switchTabGroup(tabGroup.id)
      Store.app.tabGroupsMenu.refreshHeight()
      Store.editingTabGroup = (editing) ? -1 : tabGroup.id
    }

    const onInput = (e: React.KeyboardEvent<Input>) => {
      tabGroup.title = e.currentTarget.value
    }

    const onInputKeyPress = (e: React.KeyboardEvent<Input>) => {
      if (e.which === 13) { // Enter
        Store.editingTabGroup = -1
      }
    }

    const onInputClick = (e: React.MouseEvent<Input>) => {
      e.stopPropagation()
    }

    const inputEvents = {
      onClick: onInputClick,
      onKeyPress: onInputKeyPress,
      onInput
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
          <Input ref={(r: Input) => { this.input = r }} className='input1' style={inputStyle} {...inputEvents} defaultValue={tabGroup.title}></Input>
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