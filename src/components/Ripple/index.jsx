import React from 'react'
import ReactDOM from 'react-dom'

export default class Ripple extends React.Component {
  componentDidMount () {
    // Get parent
    this.parent = ReactDOM.findDOMNode(this).parentNode
    // Add mouse down event to parent
    this.parent.addEventListener('mousedown', this.makeRipple)
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
  getPosition (center, e) {
    if (!center) {
      return {
        x: e.pageX - e.target.getBoundingClientRect().left + 'px',
        y: e.pageY - e.target.getBoundingClientRect().top + 'px'
      }
    } else {
      return {
        x: '50%',
        y: '50%'
      }
    }
  }

  /**
   * Animates ripple
   * @param {Object} event data
   */
  makeRipple = (e) => {
    const {
      center,
      opacity,
      time,
      scale
    } = this.props
    // Scales
    const scaleX = center ? scale : e.target.clientWidth
    const scaleY = center ? scale : e.target.clientHeight
    // Get ripple position
    const position = this.getPosition(center, e)
    // Create DOM element
    const element = document.createElement('span')
    element.className = 'ripple-effect'
    // Set css
    this.css(element, {
      left: position.x,
      top: position.y,
      transition: `${time}s ease-out width, ${time}s ease-out height, ${time}s opacity`,
      opacity: opacity
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
      element.style.opacity = '0'
      // Wait until animation
      setTimeout(() => {
        if (element.parentNode != null) {
          element.parentNode.removeChild(element)
        }
      }, time * 1000)
    }
    // Add events to remove the ripple
    this.parent.addEventListener('mouseup', remove)
    this.parent.addEventListener('mouseleave', remove)
  }

  render () {
    return (
      <div className='ripple-container' />
    )
  }
}

Ripple.defaultProps = {
  center: false,
  scale: 15,
  time: 0.3,
  opacity: 0.3
}