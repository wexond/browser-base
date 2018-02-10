import fs from 'fs'
import paths from '../defaults/files'

export const history = new sqlite3.Database(paths.files['history'])
export const sites = new sqlite3.Database(paths.files['sites'])
export const favicons = new sqlite3.Database(paths.files['favicons'])

history.run(`CREATE TABLE IF NOT EXISTS history(title TEXT, url TEXT, favicon TEXT, date TEXT, ogTitle TEXT, ogDescription TEXT, ogImage TEXT)`)
sites.run(`CREATE TABLE IF NOT EXISTS sites(title TEXT, url TEXT, favicon TEXT)`)
favicons.run(`CREATE TABLE IF NOT EXISTS favicons(url TEXT, favicon BLOB)`)

export const addFavicon = (url) => {
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const reader = new FileReader()
      reader.onload = () => {
        const generatedBuffer = reader.result

        console.log(generatedBuffer)

        favicons.run('INSERT INTO favicons(url, favicon) VALUES(?, ?)', [url, new Buffer(generatedBuffer)])
      }
      reader.readAsArrayBuffer(blob)
    })
}