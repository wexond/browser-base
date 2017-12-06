import Component from 'inferno-component'

export default class MenuItem extends Component {
  render () {
    return (
      <div className='menu-item' onClick={this.props.onClick}>
          { this.props.title }
          { this.props.icon &&
            <div className='icon' />
          }
      </div>
    )
  }
}

MenuItem.defaultProps = {
  icon: false
}