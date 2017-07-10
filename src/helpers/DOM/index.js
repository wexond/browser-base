Element.prototype.setCSS = function (data) {
  for (var key in data) {
    if (key === 'top' || key === 'bottom' || key === 'left' || key === 'right' || key === 'width' || key === 'height' || key.indexOf('margin') !== -1) {
      if (typeof data[key] === 'number') {
        data[key] = data[key].toString() + 'px'
      }
    }
  }
  Object.assign(this.style, data)
}

Element.prototype.getCSS = function (attribute) {
  if (this.currentStyle) return this.currentStyle[attribute]
  return document.defaultView.getComputedStyle(this, null)[attribute]
}

Element.prototype.remove = function () {
  this.parentNode.removeChild(this)
}

/**
* Loads an array of scripts URLs to document's body.
* @static
* @param {array}
*/
function loadScripts (scripts) {
  for (var i = 0; i < scripts.length; i++) {
    var script = document.createElement('script')
    script.src = scripts[i]
    document.body.appendChild(script)
  }
}

Element.prototype.setAttributes = function (attributes) {
  const keys = Object.keys(attributes)

  for (let i = 0; i < keys.length; i++) {
    const attr = keys[i]
    const value = attributes[keys[i]]

    this.setAttribute(attr, value)
  }
}