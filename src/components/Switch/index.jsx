import React from 'react'

export default class Switch extends React.Component {
  constructor () {
    super()

    this.state = {
      thumbLeft: -5,
      toggled: false
    }

    this.mouseDownPosition = {
      x: -1,
      y: -1
    }
    
    this.lastState = false
  }

  onMouseDown = (e) => {
    if (e.target !== this.track) {
      this.mouseDownPosition = {
        x: e.clientX,
        y: e.clientY
      }

      window.addEventListener('mousemove', this.onWindowMouseMove)
      window.addEventListener('mouseup', this.onWindowMouseUp)
    } else {
      this.toggle()
    }
  }

  onWindowMouseMove = (e) => {
    const rect = this.root.getBoundingClientRect()

    const {
      off,
      on
    } = this.props.thumbPosition

    if (e.clientX + -off >= rect.left && e.clientX <= rect.right) {
      let delta = e.clientX - rect.left

      if (delta <= off) delta = off

      if (delta <= on) {
        const toggled = delta >= on / 2

        this.setState({
          thumbLeft: delta,
          toggled: toggled
        })

        if (this.lastState !== toggled) {
          this.lastState = toggled
          this.triggerEvent()
        }   
      }
    }
  }

  onWindowMouseUp = (e) => {
    const {
      on,
      off
    } = this.props.thumbPosition

    if (this.mouseDownPosition.x === e.clientX) {
      this.toggle()
    } else {
      this.setState({
        thumbLeft: this.state.toggled ? on : off
      })
    }

    window.removeEventListener('mousemove', this.onWindowMouseMove)
    window.removeEventListener('mouseup', this.onWindowMouseUp)
  }

  toggle (flag = !this.state.toggled) {
    const {
      on,
      off
    } = this.props.thumbPosition

    this.setState({
      thumbLeft: flag ? on : off,
      toggled: flag
    })

    this.triggerEvent()
  }

  triggerEvent () {
    const onToggle = this.props.onToggle

    if (typeof onToggle === 'function') onToggle(this.state.toggled, this)
  }

  render () {
    const thumbStyle = {
      left: this.state.thumbLeft
    }

    return (
      <div className={'material-switch ' + (this.state.toggled ? 'toggled' : '')} ref={(r) => this.root = r} onMouseDown={this.onMouseDown}>
        <div className='track' ref={(r) => this.track = r} />
        <div className='thumb' style={thumbStyle} />
      </div>
    )
  }
}

Switch.defaultProps = {
  thumbPosition: {
    off: -5,
    on: 15
  }
}