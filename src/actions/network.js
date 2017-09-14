export const isURL = (string) => {
  if (_isURL(string)) {
    return true
  } else {
    if (_isURL('http://' + string)) {
      return true
    }
    return false
  }
}
const _isURL = (string) => {
  var pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/
  return pattern.test(string)
}