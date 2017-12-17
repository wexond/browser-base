import React from 'react'

import Store from '../../history-store'
import { observer } from 'mobx-react'

@observer
export default class HistoryToolBar extends React.Component {
  onCancel = () => {
    for (var i = 0; i < Store.selectedItems.length; i++) {
      if (Store.selectedItems[i].checkbox.state.checked) {
        Store.selectedItems[i].checkbox.setState({checked: false})
      }
    }

    Store.selectedItems = []
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
        </div>
        <div className='selection-toolbar' style={selectionToolbarStyle}>
          <div className='exit-icon' onClick={this.onCancel} />
          <div className='selected-items'>
            Selected items:
          </div>
          <div className='count'>
            {Store.selectedItems.length}
          </div>
          <div className='delete-button'>
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