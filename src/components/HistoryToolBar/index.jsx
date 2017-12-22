import React from 'react'

import Input from '../Input'

import Store from '../../history-store'
import { observer } from 'mobx-react'

@observer
export default class HistoryToolBar extends React.Component {
  constructor () {
    super()

    this.state = {
      searchInput: false
    }
  }

  onCancel = () => {
    for (var i = 0; i < Store.selectedItems.length; i++) {
      if (Store.selectedItems[i].checkbox.state.checked) {
        Store.selectedItems[i].checkbox.setState({checked: false})
      }
    }

    for (i = 0; i < Store.history.sections.length; i++) {
      Store.history.sections[i].checkbox.setState({checked: false})
    }

    Store.selectedItems = []
  }

  onDelete = async () => {
    const deletedItems = []

    for (var i = Store.selectedItems.length - 1; i >= 0; i--) {
      const selectedItem = Object.assign({}, Store.selectedItems[i])

      deletedItems.push(selectedItem)

      selectedItem.checkbox.setState({checked: false})
      Store.selectedItems.splice(Store.selectedItems.indexOf(selectedItem), 1)

      for (var y = 0; y < Store.sections.length; y++) {
        const section = Store.sections[y]

        for (var z = 0; z < section.items.length; z++) {
          const item = section.items[z]

          if (item.id === selectedItem.id) {
            section.items.splice(section.items.indexOf(item), 1)
            Store.history.setState({sections: Store.sections})
          }
        }
      }
    }

    for (i = 0; i < Store.history.sections.length; i++) {
      Store.history.sections[i].checkbox.setState({checked: false})
    }

    console.log(deletedItems)

    await window.historyAPI.delete(deletedItems)
  }

  onSearchIconClick = () => {
    this.setState({
      searchInput: !this.state.searchInput
    })

    if (!this.state.searchInput) {
      setTimeout(() => {
        this.input.input.focus()
      }, 64)
    }
  }

  render () {
    const selectingMode = Store.selectedItems.length > 0

    const normalToolbarStyle = {
      opacity: selectingMode ? 0 : 1,
      pointerEvents: selectingMode ? 'none' : 'auto'
    }

    const selectionToolbarStyle = {
      opacity: selectingMode ? 1 : 0,
      pointerEvents: selectingMode ? 'auto' : 'none'
    }

    return (
      <div className={'history-toolbar ' + ((selectingMode) ? 'selecting-mode' : '')}>
        <div className='normal-toolbar' style={normalToolbarStyle}>
          <div className='title'>
            History
          </div>
          <div className={'search-container' + (this.state.searchInput ? ' selected' : '')}>
            <div className='search-icon' onClick={this.onSearchIconClick} />
            <Input ref={(r) => this.input = r} placeholder='Search' />
            <div className='cancel-icon' />
          </div>
        </div>
        <div className='selection-toolbar' style={selectionToolbarStyle}>
          <div className='exit-icon' onClick={this.onCancel} />
          <div className='selected-items'>
            Selected items:
          </div>
          <div className='count'>
            {Store.selectedItems.length}
          </div>
          <div className='delete-button' onClick={this.onDelete}>
            delete
          </div>
          <div className='cancel-button' onClick={this.onCancel}>
            cancel
          </div>
        </div>
      </div>
    )
  }
}