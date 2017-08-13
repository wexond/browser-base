var Ripple = class Ripple {
    /**
      * creates ripple element with given parameters
      * @param {DOMElement} element
      * @param {Object} css - the css to apply for ripple element
      * @param {Object} options - the options for ripple
      * @param {DOMElement} rootElement - fake root element (optional)
      * @return {DOMElement}
      */
  static createRipple (element, css, options = {x: 0, y: 0, scale: 15, time: 0.4, scaleY: null, touch: false}, rootElement = '') {
    var rippleElement = document.createElement('span')
    rippleElement.className = 'ripple-effect'
    element.appendChild(rippleElement)
    rippleElement.css({left: options.x + 'px', top: options.y + 'px'})
    rippleElement.css(css)
    rippleElement.options = options
    if (rootElement != '') {
      rippleElement.element = rootElement
    } else {
      rippleElement.element = element
    }
    return rippleElement
  }
    /**
      * animates ripple
      * @param {DOMElement} rippleElement
      */
  static makeRipple (rippleElement) {
    if (scaleY == null) {
      scaleY = scale
    }
    var xPos = rippleElement.options.x,
      yPos = rippleElement.options.y,
      scale = rippleElement.options.scale,
      time = rippleElement.options.time,
      scaleY = rippleElement.options.scaleY,
      size = 0,
      touch = rippleElement.options.touch

    if (scaleY == null) {
      scaleY = scale
    }

    var animateSize = parseInt(Math.max(scale, scaleY) * Math.PI)

    rippleElement.style.transition = time + 's width, ' + time + 's height, 0.4s opacity'

    setTimeout(function () {
      rippleElement.style.width = animateSize + 'px'
      rippleElement.style.height = animateSize + 'px'
    }, 10)

    function removeRipple () {
      rippleElement.style.opacity = '0'
      setTimeout(function () {
        if (rippleElement.parentNode != null) {
          rippleElement.parentNode.removeChild(rippleElement)
        }
      }, 400)

      if (touch) {
        document.removeEventListener('touchend', removeRipple)
      } else {
        document.removeEventListener('mouseout', removeRipple)
        document.removeEventListener('mouseup', removeRipple)
      }
    }

    if (touch) {
      document.addEventListener('touchend', removeRipple)
    } else {
      document.addEventListener('mouseout', removeRipple)
      document.addEventListener('mouseup', removeRipple)
    }
  }
}

/**
  * configures ripple that is starting from center for given element
  * @param {DOMElement} item
  * @param {Number} scale (optional)
  * @param {Number} time (optional)
  */
function createRippleCenter (item, scale = 15, time = 0.4, touch = false) {
  return {x: item.clientWidth / 2, y: item.clientHeight / 2, scale: scale, time: time, touch: touch}
}

/**
  * configures ripple that is starting from mouse point for given element
  * @param {DOMElement} item
  * @param {Number} scale (optional)
  * @param {Number} time (optional)
  */
function createRippleMouse (item, e, time = 1, touch = false) {
  var relX = (!touch) ? e.pageX - item.getBoundingClientRect().left : e.touches[0].clientX - item.getBoundingClientRect().left
  var relY = (!touch) ? e.pageY - item.getBoundingClientRect().top : e.touches[0].clientY - item.getBoundingClientRect().top
  return {x: relX, y: relY, scale: item.clientWidth, time: time, scaleY: item.clientHeight, touch: touch}
}

/**
  * changes css of given element
  * this function is setter and getter
  * @param {Object | String} data
  * @param {String} value (optional)
  * @return {Object} - style for element
*/
Element.prototype.css = function (data, value = null) {
  if (typeof (data) === 'object') {
    Object.assign(this.style, data)
  } else {
    if (value != null) {
      this.style[data] = value
    } else {
      return this.style[data]
    }
  }
}
