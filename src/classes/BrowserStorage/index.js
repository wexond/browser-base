// TODO: add removeHistory and getHistoryIndex methods
export default class BrowserStorage {
  /**
   * Adds history item.
   * @param {string} title
   * @param {string} url
   * @param {function} callback
   */
  static addHistoryItem (title, url, callback = null) {
    var fs = require('fs')
    if (title != null && url != null) {
      // Get today's date.
      var today = new Date()
      var dd = today.getDate()
      var mm = today.getMonth() + 1
      var yyyy = today.getFullYear()

      if (dd < 10) {
        dd = '0' + dd
      }

      if (mm < 10) {
        mm = '0' + mm
      }

      today = mm + '-' + dd + '-' + yyyy

      // Read history.json file and append new history items.
      fs.readFile(global.historyPath, function (error1, data) {
        if (error1) {
          console.error(error1)
          return
        }
        var jsonObject = JSON.parse(data)
        if (!url.startsWith('wexond://') && !url.startsWith('about:blank')) {
          // Get current time.
          var date = new Date()
          var currentHour = date.getHours()
          var currentMinute = date.getMinutes()
          var time = `${currentHour}:${currentMinute}`

          // Configure newItem's data.
          var newItem = {
            'url': url,
            'title': title,
            'date': today,
            'time': time
          }

          // Get newItem's new id.
          if (jsonObject[jsonObject.length - 1] == null) {
            newItem.id = 0
          } else {
            newItem.id = jsonObject[jsonObject.length - 1].id + 1
          }

          // Push new history item.
          jsonObject.push(newItem)

          // Save the changes.
          BrowserStorage.saveHistory(JSON.stringify(jsonObject), callback)
        }
      })
    }
  }
  /**
   * Saves history.
   * @param {string} json
   * @param {function} callback
   */
  static saveHistory (json, callback = null) {
    var fs = require('fs')

    fs.writeFile(global.historyPath, json, function (error) {
      if (error) {
        BrowserStorage.resetHistory()
        console.error(error)
      } else {
        if (callback != null) {
          // Execute callback.
          callback()
        }
      }
    })
  }
  /**
   * Resets history.
   * @param {function} callback
   */
  static resetHistory (callback = null) {
    BrowserStorage.saveHistory('[]', callback)
  }
  /**
   * Gets history json object.
   * @return {object}
   */
  static getHistory (callback = null) {
    var fs = require('fs')
    fs.readFile(global.historyPath, function (error, data) {
      if (error) {
        callback(null, error)
      } else {
        callback(data, null)
      }
    })
  }
}
