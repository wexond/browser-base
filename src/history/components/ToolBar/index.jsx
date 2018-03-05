import React from 'react'

import Input from '../../Material/Input'
import FlatButton from '../../Material/FlatButton'
import Ripple from '../../Material/Ripple'


import Store from '../../stores/history'
import { observer } from 'mobx-react'

@observer
export default class ToolBar extends React.Component {
  constructor () {
    super()

    this.state = {
      searchInput: false
    }
  }

  onSearchIconClick = () => {
    this.setState({searchInput: !this.state.searchInput})

    if (!this.state.searchInput) {
      setTimeout(() => {
        this.input.input.focus()
      }, 64)
    } else {
      this.props.onSearch(this.input.getValue())
    }
  }

  onSearchCancelIconClick = () => {
    if (this.state.searchInput) {
      this.setState({searchInput: false})
      this.input.setValue('')
    }
  }

  onInputKeyPress = (e) => {
    // Enter
    if (e.which === 13) {
      this.props.onSearch(this.input.getValue())
    }
  }

  componentWillReceiveProps () {
    const metaTags = document.getElementsByTagName('meta')

    for (var i = 0; i < metaTags.length; i++) {
      if (metaTags[i].getAttribute('name') === 'theme-color') {
        const color = Store.selectedItems.length === 0 ? '#303F9F' : '#1E88E5'

        metaTags[i].setAttribute('content', color)
        break
      }
    }
  }

  render () {
    const {
      title,
      selectedItems,
      onSearch,
      onCancel,
      onDelete
    } = this.props

    const selectingMode = selectedItems.length > 0

    const normalToolbarStyle = {
      opacity: selectingMode ? 0 : 1,
      pointerEvents: selectingMode ? 'none' : 'auto'
    }

    const selectionToolbarStyle = {
      opacity: selectingMode ? 1 : 0,
      pointerEvents: selectingMode ? 'auto' : 'none'
    }

    const actions = window.dictionary.actions
    const searching = window.dictionary.searching

    return (
      <div className={'history-toolbar ' + ((selectingMode) ? 'selecting-mode' : '')}>
        <div className='normal-toolbar' style={normalToolbarStyle}>
          <div className='title'>
            {title}
          </div>
          <div className={'search-container' + (this.state.searchInput ? ' selected' : '')}>
            <div className='search-icon' onClick={this.onSearchIconClick}>
              <Ripple center={true} opacity={0.2} />
            </div>
            <Input ref={(r) => this.input = r} placeholder={searching.search} onKeyPress={this.onInputKeyPress} />
            <div className='cancel-icon' onClick={this.onSearchCancelIconClick}>
              <Ripple center={true} opacity={0.2} />
            </div>
          </div>
        </div>
        <div className='selection-toolbar' style={selectionToolbarStyle}>
          <div className='exit-icon' onClick={onCancel}>
            <Ripple center={true} />
          </div>
          <div className='selected-items'>
            {actions.selectedItems}:
          </div>
          <div className='count'>
            {selectedItems.length}
          </div>
          <FlatButton color='#fff' onClick={onDelete} className='delete-button'>
            {actions.delete}
          </FlatButton>
          <FlatButton color='#fff' onClick={onCancel} className='cancel-button'>
            {actions.cancel}
          </FlatButton>
        </div>
      </div>
    )
  }
}

ToolBar.defaultProps = {
  title: 'Title',
  selectedItems: []
}