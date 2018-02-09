import paths from '../defaults/files'
import fs from 'fs'

export const checkFiles = () => {
  for (var key in paths.directories) {
    let path = paths.directories[key]
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  }
  for (var key in paths.files) {
    let file = paths.files[key]

    if (typeof file === 'object') {
      if (!fs.existsSync(file.path)) {
        fs.writeFileSync(file.path, JSON.stringify(file.defaultContent))
      }
    } else {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '[]')
      }
    }
  }
}