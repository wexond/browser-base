const fs = require('fs')
const paths = require('../defaults/files')

if (window.location.protocol === 'wexond:') {
  window.env = process.env.NODE_ENV

  window.settingsAPI = {
    get: () => {
      return new Promise((resolve, reject) => {
        fs.readFile(paths.files.settings.path, async (error, data) => {
          if (error) {
            reject(error)
          } else {
            const json = JSON.parse(data)
            resolve(json)
          }
        })
      })
    },
    save: (data) => {
      return new Promise((resolve, reject) => {
        fs.writeFileSync(paths.files.settings.path, JSON.stringify(data))
        resolve()
      })
    }
  }
}
