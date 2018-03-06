import fs from 'fs'
import paths from '../defaults/files'

export const checkFiles = (): void => {
  for (const key in paths.directories) {
    const path = paths.directories[key]
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  }
  for (const key in paths.files) {
    const file = paths.files[key]

    if (typeof file === 'object' && file.autoCreate && !fs.existsSync(file.path)) {
      fs.writeFileSync(file.path, JSON.stringify(file.defaultContent))
    }
  }
}