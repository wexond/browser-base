export default class Colors {
  /**
   * Calculates foreground color based on background color.
   * @param {String} color - color in hex
   * @return {String}
   */
  static getForegroundColor (color) {
    var brightness = Colors.colorBrightness(color)
    if (brightness < 130) {
      return 'white'
    } else {
      return 'black'
    }
  }
  /**
   * Shades given color.
   * @param {String} hex
   * @param {Number} lum - luminace
   * @return {String} - new color hex
   */
  static shadeColor (hex, lum) {
    if (hex == null) { return null }

    hex = String(hex).replace(/[^0-9a-f]/gi, '')
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    lum = lum || 0
    var rgb = '#'
    var c
    var i
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16)
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
      rgb += ('00' + c).substr(c.length)
    }
    return rgb
  }
  /**
   * Converts RGB color to hex.
   * @param {String} rgb
   * @return {String} - hex of RGB color
   */
  static rgbToHex (rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
     ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }
  /**
   * Extracts brightness from color.
   * @param {String} color
   * @return {Number} - the brightness
   */
  static colorBrightness (color) {
    if (color == null) { return null }

    var r
    var g
    var b
    var brightness
    var colour = color
    if (colour.match(/^rgb/)) {
      colour = colour.match(/rgba?\(([^)]+)\)/)[1]
      colour = colour.split(/ *, */).map(Number)
      r = colour[0]
      g = colour[1]
      b = colour[2]
    } else if (colour[0] === '#' && colour.length === 7) {
      r = parseInt(colour.slice(1, 3), 16)
      g = parseInt(colour.slice(3, 5), 16)
      b = parseInt(colour.slice(5, 7), 16)
    } else if (colour[0] === '#' && colour.length === 4) {
      r = parseInt(colour[1] + colour[1], 16)
      g = parseInt(colour[2] + colour[2], 16)
      b = parseInt(colour[3] + colour[3], 16)
    }
    brightness = (r * 299 + g * 587 + b * 114) / 1000

    return brightness
  }
  /**
   * Converts hex color to RGB.
   * @param {String} hex
   * @return {Object} - rgb
   */
  static hexToRgb (hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    })

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
      : null
  }
}
