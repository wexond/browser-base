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

  static async saveHistory (jsonObject) {
    return new Promise((resolve, reject) => {
      fs.writeFile(paths.files.history, JSON.stringify(jsonObject), function (error) {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  static async resetHistory () {
    return new Promise((resolve, reject) => {
      Storage.saveHistory([]).then(() => {
        resolve()
      }).catch(() => {
        reject(error)
      })
    })
  }

  static getHistory () {
    return new Promise((resolve, reject) => {
      fs.readFile(paths.files.history, function (error, data) {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(data))
        }
      })
    })
  }
}