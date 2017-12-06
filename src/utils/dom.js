/**
 * Loads an array of scripts URLs to document's body.
 * @param {Array}
 */
function loadScripts (scripts) {
  for (var i = 0; i < scripts.length; i++) {
    let script = document.createElement('script')
    script.src = scripts[i]
    document.body.appendChild(script)
  }
}