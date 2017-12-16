import React from 'react'

export default class HistoryToolBar extends React.Component {
  constructor () {
    super()

    this.state = {
      titleOpacity: 1,
      containerDisplay: false,
      containerOpacity: 0
    }
  }

  toggle = (flag) => {
    if (flag) {
      this.setState({titleOpacity: 0, containerDisplay: true})

      setTimeout(() => {
        this.setState({containerOpacity: 1})
      }, 10)
    } else {
      this.setState({titleOpacity: 1, containerOpacity: 0})

      setTimeout(() => {
        this.setState({containerDisplay: false})
      }, 150)
    }
  }

  componentWillReceiveProps () {
    this.toggle(this.props.selectedUrls.length > 0)
  }

  render () {
    const titleStyle = {
      opacity: this.state.titleOpacity
    }

    const containerStyle = {
      display: !this.state.containerDisplay ? 'none' : 'block',
      opacity: this.state.containerOpacity
    }

    return (
      <div className='history-toolbar'>
        <div className='title' style={titleStyle}>
          History
        </div>
        <div className='controls-container' style={containerStyle}>
          <div className='exit-icon' onClick={this.props.onExitIconClick} />
          <div className='selected-items'>
            Selected items:
          </div>
          <div className='count'>
            {this.props.selectedUrls.length}
          </div>
          <div className='delete-button'>
            delete
          </div>
          <div className='cancel-button'>
            cancel
          </div>
        </div>
      </div>
    )
  }
}