import Component from 'inferno-component'

import MenuItem from '../MenuItem'

export default class Menu extends Component {
  constructor () {
    super()

    this.state = {
      top: 0,
      left: 0,
      height: 0,
      opacity: 0,
      display: false
    }

    this.shown = false
  }

  toggle (flag, e) {
    if (flag) {
      const top = e.target.getBoundingClientRect().top

      this.setState({
        display: true,
        top: top
      })

      setTimeout(() => {
        this.setState({
          height: this.root.scrollHeight,
          opacity: 1,
          top: top + 8
        })
      }, 10)

      document.addEventListener('mousedown', this.onDocumentMouseDown)
    } else {
      this.setState({
        height: 0,
        opacity: 0,
        top: this.state.top - 8
      })

      setTimeout(() => {
        this.setState({
          display: false
        })
      }, 200)

      document.removeEventListener('mousedown', this.onDocumentMouseDown)
    }

    this.shown = flag
  }

  onDocumentMouseDown = (e) => {
    this.toggle(false)
  }

  render () {
    const style = {
      top: this.state.top,
      opacity: this.state.opacity,
      maxHeight: this.state.height,
      display: this.state.display ? 'block' : 'none'
    }

    return (
      <div className='material-menu' style={style} ref={(r) => { this.root = r }}>
          {
            this.props.items.map((data, key) => {
              if (data.type === 'separator') {
                return <div className='separator' />
              } else {
                return <MenuItem title={data.title} icon={data.icon} onClick={data.onClick} />
              }
            })
          }
      </div>
    )
  }
}