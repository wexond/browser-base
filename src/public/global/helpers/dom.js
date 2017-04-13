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
