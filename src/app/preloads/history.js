const fs = require('fs')
const paths = require('../defaults/files')

const sqlite3 = require('sqlite3').verbose()

const history = new sqlite3.Database(paths.files.history)
const favicons = new sqlite3.Database(paths.files.favicons)

if (window.location.protocol === 'wexond:') {
  window.env = process.env.NODE_ENV
  window.historyAPI = {
    get: () => {
      return new Promise((resolve, reject) => {
        history.all('SELECT * FROM history', (err, hist) => {
          if (err) { reject(err) }
          else {
            favicons.all('SELECT * FROM favicons', (err, favs) => {
              for (let i = 0; i < hist.length; i++) {
                const favicon = hist[i].favicon
                if (favicon != null && favicon != '') {
                  const fav = window.historyAPI.getFaviconData(favs, favicon)

                  var reader  = new FileReader()

                  reader.onloadend = function () {
                    hist[i].favicon = reader.result
                  }
                  reader.readAsDataURL(new Blob([fav]))
                }
              }

              console.log(hist)

              resolve(hist)
            })
          }
        })
      })
    },
    delete: async (items) => {
      for (var x = 0; x < items.length; x++) {
        if (items[x] != null) {
          history.run('DELETE FROM history WHERE id = ?', [items[x].id])
        }
      }
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
    getFaviconData: (data, url) => {
      for (var i = 0; i < data.length; i++) {
        if (data[i].url === url) { return data[i].data }
      }
    }
  }
}
