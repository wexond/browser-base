/**
 * Creates div element.
 * @param {Object} data 
 * @param {DOMElement} parent 
 */
function div (data = {}, parent = null) {
  let element = document.createElement('div')
  Object.assign(element, data)
  if (parent != null) parent.appendChild(element)
  return element
}

/**
 * Creates element.
 * @param {String} type 
 * @param {Object} data 
 * @param {DOMElement} parent 
 */
function createElement (type, data = {}, parent = null) {
  let element = document.createElement(type)
  Object.assign(element, data)
  if (parent != null) parent.appendChild(element)
  return element
}

/**
 * Changes style attribute or gets value of the attribute.
 * @param {Object | String} data
 * @param {*} value
 * @return {*}
 */
Element.prototype.css = function (data, value = null) {
  if (typeof data === 'object') {
    for (var key in data) {
      if (key === 'top' || key === 'bottom' || key === 'left' || key === 'right' || key === 'width' || key === 'height' || key.indexOf('margin') !== -1) {
        if (typeof data[key] === 'number') {
          data[key] = data[key].toString() + 'px'
        }
      }
    }
    Object.assign(this.style, data)
  } else if (typeof data === 'string') {
    if (value != null) {
      if (data === 'top' || data === 'bottom' || data === 'left' || data === 'right' || data === 'width' || data === 'height' || data.indexOf('margin') !== -1) {
        if (typeof value === 'number') {
          value = value.toString() + 'px'
        }
      }
      this.style[data] = value
    } else {
      return this.style[data]
    }
  }
  return null
}

class DOMHelper {
  /**
   * Loads an array of scripts URLs to document's body.
   * @static
   * @param {array}
   */
  static loadScripts (scripts) {
    for (var i = 0; i < scripts.length; i++) {
      var script = document.createElement('script')
      script.src = scripts[i]
      document.body.appendChild(script)
    }
  }
}
