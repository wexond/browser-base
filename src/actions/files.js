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
    let path = paths.files[key]
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, '[]')
    }
  }
}