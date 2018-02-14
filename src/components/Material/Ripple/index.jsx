import React from 'react'
import ReactDOM from 'react-dom'

export default class Ripple extends React.Component {
  constructor () {
    super()

    this.isTouch = false
  }

  componentDidMount () {
    const {
      center,
      touchSupport,
      autoRipple,
      autoClass
    } = this.props

    // Get the parent
    this.parent = ReactDOM.findDOMNode(this).parentNode

    if (autoClass) {
      // Add ripple class
      this.parent.classList.add(!center ? 'material-ripple' : 'material-ripple-icon')
    }

    if (autoRipple) {
      // Add events to the parent
      this.parent.addEventListener('mousedown', this.makeRipple)
      // If support touch
      if (touchSupport) {
        this.parent.addEventListener('touchstart', this.makeRipple)
      }
    }
  }

  /**
    * Changes css of given element
    * this function is setter and getter
    * @param {DOMElement} element
    * @param {Object | String} data
    * @param {String} value (optional)
    * @return {Object} style for element
  */
  css (element, data, value) {
    if (typeof (data) === 'object') {
      Object.assign(element.style, data)
    } else {
      if (value != null) {
        element.style[data] = value
      } else {
        return element.style[data]
      }
    }
  }

  /**
   * Calculates position
   * @param {Boolean} is center
   * @param {Object} event data
   * @return {Object} positions
   */
  getPosition (center, offsetX, e) {
    if (!center) {
      let pos = {
        x: -1,
        y: -1
      }

      if (e.type === 'touchstart') {
        const touch = e.touches[0]

        pos = {
          x: touch.pageX,
          y: touch.pageY
        }
      } else {
        pos = {
          x: e.pageX,
          y: e.pageY
        }
      }

      return {
        x: pos.x - this.parent.getBoundingClientRect().left + 'px',
        y: pos.y - this.parent.getBoundingClientRect().top + 'px'
      }
    } else {
      return {
        x: 50 + offsetX + '%',
        y: '50%'
      }
    }
  }

  /**
   * Animates ripple
   * @param {Object} event data
   */
  makeRipple = (e) => {
    const options = this.props.options
    const props = Object.assign({}, this.props)

    if (options != null && typeof options === 'object') {
      Object.assign(props, options)
    }

    const {
      center,
      offsetX,
      opacity,
      time,
      scale,
      touchSupport,
      color
    } = props

    const isEventTouch = (e.type === 'touchstart')
    if (isEventTouch && !touchSupport || isEventTouch && e.touches.length > 1) return

    if (isEventTouch) this.isTouch = true
    else if (this.isTouch) return

    // Scales
    const scaleX = center ? scale : this.parent.clientWidth
    const scaleY = center ? scale : this.parent.clientHeight
    // Get ripple position
    const position = this.getPosition(center, offsetX, e)
    // Create DOM element
    const element = document.createElement('span')
    element.className = 'material-ripple-effect'
    // Set css
    this.css(element, {
      left: position.x,
      top: position.y,
      transition: `${time}s ease-out width, ${time}s ease-out height, ${time}s opacity`,
      opacity: opacity,
      backgroundColor: color
    })
    // Append the element to parent
    this.parent.appendChild(element)
    // Calculate the ripple size
    const animateSize = parseInt(Math.max(scaleX, scaleY) * Math.PI)
    // Wait 1 ms, because there is bug with display
    setTimeout(() => {
      this.css(element, {
        width: animateSize + 'px',
        height: animateSize + 'px'
      })
    }, 1)
    // Removes the ripple
    const remove = (e) => {
      setTimeout(() => {
        element.style.opacity = '0'
      }, 100)
      // Wait until animation
      setTimeout(() => {
        if (element.parentNode != null) {
          element.parentNode.removeChild(element)
          this.isTouch = false

          window.removeEventListener('mouseup', remove)
          this.parent.removeEventListener('mouseleave', remove)
          window.addEventListener('touchend', remove)
        }
      }, time * 1000)
    }
    // Add events to remove the ripple
    if (!isEventTouch) {
      window.addEventListener('mouseup', remove)
      this.parent.addEventListener('mouseleave', remove)
    } else {
      window.addEventListener('touchend', remove)
    }
  }

  render () {
    return (
      <div style={{display: 'none'}} />
    )
  }
}

Ripple.defaultProps = {
  center: false,
  offsetX: 0,
  scale: 14,
  time: 0.4,
  opacity: 0.15,
  touchSupport: true,
  color: '#000',
  autoRipple: true,
  autoClass: true
}