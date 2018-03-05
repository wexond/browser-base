import fs from 'fs'
import paths from '../defaults/files'

export const history = new sqlite3.Database(paths.files.history)
export const favicons = new sqlite3.Database(paths.files.favicons)

history.run(`CREATE TABLE IF NOT EXISTS history(id INTEGER PRIMARY KEY, title TEXT, url TEXT, favicon TEXT, date TEXT, ogTitle TEXT, ogDescription TEXT, ogImage TEXT)`)
favicons.run(`CREATE TABLE IF NOT EXISTS favicons(id INTEGER PRIMARY KEY, url TEXT, favicon BLOB)`)

export const addFavicon = (url) => {
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const reader = new FileReader()
      reader.onload = () => {
        const generatedBuffer = reader.result

        console.log(generatedBuffer)
        favicons.run('INSERT INTO favicons(url, favicon) SELECT ?, ? WHERE NOT EXISTS(SELECT 1 FROM favicons WHERE url = ?)', [url, new Buffer(generatedBuffer), url])
      }
      reader.readAsArrayBuffer(blob)
    })
}
