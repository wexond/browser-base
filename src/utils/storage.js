import fs from 'fs'
import paths from '../defaults/files'

import base64Img from 'base64-img'

export default class Storage {
  static async addHistoryItem (title, url, favicon, ogData = {}) {
    return new Promise(async (resolve, reject) => {
      if (title != null && url != null) {
        // Get today's date.
        let today = new Date()
        let dd = today.getDate()
        let mm = today.getMonth() + 1
        let yyyy = today.getFullYear()
  
        if (dd < 10) {
          dd = '0' + dd
        }
  
        if (mm < 10) {
          mm = '0' + mm
        }
  
        today = mm + '-' + dd + '-' + yyyy
  
        let data = await Storage.getHistory()
  
        if (!url.startsWith('wexond://') && !url.startsWith('about:blank')) {
          // Get current time.
          let date = new Date()
          let currentHour = ('0' + date.getHours()).slice(-2)
          let currentMinute = ('0' + date.getMinutes()).slice(-2)
          let time = `${currentHour}:${currentMinute}`
  
          // Configure newItem's data.
          let newItem = {
            'url': url,
            'title': title,
            'date': today,
            'time': time,
            'favicon': favicon,
            'ogData': ogData
          }
  
          // Get newItem's new id.
          if (data[data.length - 1] == null) {
            newItem.id = 0
          } else {
            newItem.id = data[data.length - 1].id + 1
          }
  
          // Push new history item.
          data.push(newItem)
  
          await Storage.saveHistory(data)

          resolve(data.indexOf(newItem))
        }
      }
    })
  }

  static saveHistory (jsonObject) {
    return new Promise((resolve, reject) => {
      fs.writeFile(paths.files.history, JSON.stringify(jsonObject), (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  static getHistory () {
    return new Promise((resolve, reject) => {
      fs.readFile(paths.files.history, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(data))
        }
      })
    })
  }

  static async addSite (title, url, favicon) {
    return new Promise(async (resolve, reject) => {
      if (title != null && url != null) {
        let data = await Storage.getSites()
  
        if (!url.startsWith('wexond://') && !url.startsWith('about:blank')) {
          // Configure newItem's data.
          let newItem = {
            url: url,
            title: title,
            favicon: favicon
          }
  
          let canSave = true
  
          for (var i = 0; i < data.length; i++) {
            if (data[i].url === newItem.url) {
              canSave = false
              break
            }
          }
  
          if (!canSave) return
  
          // Get newItem's new id.
          if (data[data.length - 1] == null) {
            newItem.id = 0
          } else {
            newItem.id = data[data.length - 1].id + 1
          }
  
          // Push new history item.
          data.push(newItem)
  
          await Storage.saveSites(data)

          resolve(data.indexOf(newItem))
        }
      }
    })
  }

  static saveSites (jsonObject) {
    return new Promise((resolve, reject) => {
      fs.writeFile(paths.files.sites, JSON.stringify(jsonObject), (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  static getSites () {
    return new Promise((resolve, reject) => {
      fs.readFile(paths.files.sites, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(data))
        }
      })
    })
  }

  static async addFavicon (url) {
    if (url != null) {
      let data = await Storage.getFavicons()

      if (!url.startsWith('wexond://') && !url.startsWith('about:blank')) {
        base64Img.requestBase64(url, async (err, res, body) => {
          if (err) console.error(err)
          // Configure newItem's data.
          let newItem = {
            url: url,
            data: body
          }

          let canSave = true

          for (var i = 0; i < data.length; i++) {
            if (data[i].url === newItem.url) {
              canSave = false
              break
            }
          }

          if (!canSave) return

          // Get newItem's new id.
          if (data[data.length - 1] == null) {
            newItem.id = 0
          } else {
            newItem.id = data[data.length - 1].id + 1
          }

          // Push new history item.
          data.push(newItem)

          await Storage.saveFavicons(data)
        })
      }
    }
  }

  static saveFavicons (jsonObject) {
    return new Promise((resolve, reject) => {
      fs.writeFile(paths.files.favicons, JSON.stringify(jsonObject), (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  static getFavicons () {
    return new Promise((resolve, reject) => {
      fs.readFile(paths.files.favicons, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(data))
        }
      })
    })
  }
}