import React from 'react'

export default class Checkbox extends React.Component {
  constructor () {
    super()

    this.state = {
      toggled: false
    }
  }

  onClick = (e) => {
    this.setState({
      toggled: !this.state.toggled
    })

    if (typeof this.props.onCheck === 'function') this.props.onCheck(this.state.toggled)
  }

  render () {
    const borderClass = `checkbox-border ${!this.state.toggled ? '' : 'checkbox-animation'}`
    const iconClass = `checkbox-icon ${!this.state.toggled ? 'checkbox-hide' : 'checkbox-icon-animation'}`

    const borderStyle = {
      borderWidth: (!this.state.toggled || this.root == null) ? 2 : this.root.offsetWidth / 2
    }

    return (
      <div className='checkbox' ref={(r) => this.root = r} onClick={this.onClick}>
        <div className={borderClass} style={borderStyle} />
        <div className={iconClass} />
      </div>
    )
  }
}