import Component from 'inferno-component'

export default class Checkbox extends Component {
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
    const borderClass = `border ${!this.state.toggled ? '' : 'animation'}`
    const iconClass = `icon ${!this.state.toggled ? 'hide' : 'animation'}`

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