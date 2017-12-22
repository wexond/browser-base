const fs = require('fs')
const paths = require('../defaults/files')

if (window.location.protocol === 'wexond:') {
  window.env = process.env.NODE_ENV
  window.historyAPI = {
    get: () => {
      return new Promise((resolve, reject) => {
        fs.readFile(paths.files.history, (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(JSON.parse(data))
          }
        })
      })
    },
    delete: async (items) => {
      const data = await window.historyAPI.get()
  
      for (var x = data.length - 1; x >= 0; x--) {
        for (var y = 0; y < items.length; y++) {
          if (data[x] != null && data[x].id === items[y].id) {
            data.splice(data.indexOf(data[x]), 1)
          }
        }
      }

      await window.historyAPI.save(data)
    },
    save: (data) => {
      return new Promise((resolve, reject) => {
        fs.writeFile(paths.files.history, JSON.stringify(data), (error) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      })
    },
    search: (data, str) => {
      return new Promise((resolve, reject) => {
        const matches = []

        for (var i = 0; i < data.length; i++) {
          const item = data[i]

          if ((item.url.split('/')[2]).includes(str) || item.title.includes(str)) {
            matches.push(item)
          }
        }

        resolve(matches)
      })
    }
  }
}
