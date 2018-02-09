const fs = require('fs')
const paths = require('../defaults/files')

if (window.location.protocol === 'wexond:') {
  window.env = process.env.NODE_ENV
  window.historyAPI = {
    get: () => {
      return new Promise((resolve, reject) => {
        fs.readFile(paths.files.history, async (error, data) => {
          if (error) {
            reject(error)
          } else {
            const favicons = await window.historyAPI.getFavicons()
            const json = JSON.parse(data)

            for (var i = 0; i < json.length; i++) {
              const favicon = json[i].favicon
              if (favicon != null && favicon != '' && favicon !== 'handled' && !favicon.startsWith('data'))  {
                const fav = await window.historyAPI.getFaviconData(favicons, favicon)
                json[i].favicon = fav
              }
            }
            
            resolve(json)
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
    },
    getFavicons: () => {
      return new Promise((resolve, reject) => {
        fs.readFile(paths.files.favicons, (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(JSON.parse(data))
          }
        })
      })
    },
    getFaviconData: (data, url) => {
      return new Promise((resolve, reject) => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].url === url) resolve(data[i].data)
        }
      })
    }
  }
}
