import Component from '../../classes/Component'

export default class MenuItem extends Component {
  beforeRender () {
    this.defaultProps = {
      show: true,
      enabled: true
    }
  }

  render () {
    const self = this

    function onClick () {
      self.props.menu.hide()
      if (typeof self.props.onClick === 'function') {
        self.props.onClick()
      }
    }

    return (
      <div style={{display: (this.props.show) ? 'block' : 'none'}} className={'menu-item ' + ((this.props.enabled) ? 'menu-item-enabled' : 'menu-item-disabled')} onClick={onClick}>
        <div className='menu-item-text'>
          {this.props.children}
        </div>
      </div>
    )
  }

  afterRender () {
    this.props.menu.menuItemsRendered.push(this)
  }
}