export default class Network {
  /**
   * Requests URL and gets response.
   * @param {string} url
   * @param {function(response)} callback (optional)
   */
  static requestUrl (url, callback = null) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        if (callback != null) {
          if (xmlHttp.statusText === 'OK') {
            callback(xmlHttp.responseText, null)
          } else {
            callback(xmlHttp.responseText, xmlHttp.statusText)
          }
        }
      }
    }

    xmlHttp.onerror = function (e) {
      callback(xmlHttp.responseText, xmlHttp.statusText)
    }

    xmlHttp.open('GET', url, true)
    xmlHttp.send()
  }
  /**
   * Checks if given string is an URL.
   * @param {string} string
   * @return {boolean}
   */
  static isURL (string) {
    if (Network._isURL(string)) {
      return true
    } else {
      if (Network._isURL('http://' + string)) {
        return true
      }
      return false
    }
  }
  static _isURL (string) {
    var pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/
    return pattern.test(string)
  }

  static getDomain (url) {
    let hostname = url

    if (hostname.indexOf('http://') !== -1 || hostname.indexOf('https://') !== -1) {
      hostname = hostname.split('://')[1]
    }

    if (hostname.indexOf('?') !== -1) {
      hostname = hostname.split('?')[0]
    }

    if (hostname.indexOf('://') !== -1) {
      hostname = hostname.split('://')[0] + '://' + hostname.split('/')[2]
    } else {
      hostname = hostname.split('/')[0]
    }

    return hostname
  }
}
