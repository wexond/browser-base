import React from 'react'

export default class Checkbox extends React.Component {
  constructor () {
    super()

    this.state = {
      checked: false
    }
  }

  onClick = (e) => {
    this.setState({
      checked: !this.state.checked
    })

    if (typeof this.props.onCheck === 'function') this.props.onCheck(!this.state.checked, this)
  }

  render () {
    const borderClass = `checkbox-border ${!this.state.checked ? '' : 'checkbox-animation'}`
    const iconClass = `checkbox-icon ${!this.state.checked ? 'checkbox-hide' : 'checkbox-icon-animation'}`

    const borderStyle = {
      borderWidth: (!this.state.checked || this.root == null) ? 2 : this.root.offsetWidth / 2
    }

    return (
      <div className='checkbox' ref={(r) => this.root = r} onClick={this.onClick}>
        <div className={borderClass} style={borderStyle} />
        <div className={iconClass} />
      </div>
    )
  }
}