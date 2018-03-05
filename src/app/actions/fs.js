import fs from 'fs'

const fsPromised = {
  access: (path, mode) => {
    return new Promise((resolve, reject) => {
      fs.access(path, mode, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  },
  access: (path) => {
    return new Promise((resolve, reject) => {
      fs.access(path, fs.constants.R_OK, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  },
  readdir: (path, options) => {
    return new Promise((resolve, reject) => {
      fs.readdir(path, options, (err, files) => {
        if (err) return reject(err)
        resolve(files)
      })
    })
  },
  readdir: (path) => {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        if (err) return reject(err)
        resolve(files)
      })
    })
  },
  readFile: (path, options) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, options, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  },
  readFile: (path) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }
}

export default fsPromised