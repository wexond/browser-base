import React from 'react'

import Input from '../Input'
import Ripple from '../Ripple'

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
            <Input ref={(r) => this.input = r} placeholder='Search' onKeyPress={this.onInputKeyPress} />
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
            Selected items:
          </div>
          <div className='count'>
            {selectedItems.length}
          </div>
          <div className='delete-button' onClick={onDelete}>
            delete
            <Ripple time={0.6} />
          </div>
          <div className='cancel-button' onClick={onCancel}>
            cancel
            <Ripple time={0.6} />
          </div>
        </div>
      </div>
    )
  }
}

ToolBar.defaultProps = {
  title: 'Title',
  selectedItems: []
}