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
    delete: async (item) => {
      const data = await window.historyAPI.get()
  
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === item.id) {
          data.splice(i, 1)
          await window.historyAPI.save(data)
          break
        }
      }
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
