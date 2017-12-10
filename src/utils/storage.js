import fs from 'fs'
import { paths } from '../defaults/files'

export default class Storage {
  static async addHistoryItem (title, url) {
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
        let currentHour = date.getHours()
        let currentMinute = date.getMinutes()
        let time = `${currentHour}:${currentMinute}`

        // Configure newItem's data.
        let newItem = {
          'url': url,
          'title': title,
          'date': today,
          'time': time
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
      }
    }
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

  static async addSite (title, url) {
    if (title != null && url != null) {
      let data = await Storage.getSites()

      if (!url.startsWith('wexond://') && !url.startsWith('about:blank')) {
        // Configure newItem's data.
        let newItem = {
          'url': url,
          'title': title
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
      }
    }
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
}