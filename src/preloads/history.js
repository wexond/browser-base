const fs = require('fs')
const paths = require('../defaults/files')

if (window.location.protocol === 'wexond:') {
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
          if (data[x].id === items[y].id) {
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
    }
  }  
}
