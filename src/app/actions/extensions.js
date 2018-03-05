import fsPromised from '../actions/fs'
import path from 'path'

import paths from '../defaults/files'

import Store from '../store'

let id = 0

export const loadExtensions = async () => {
  try {
    const extensionsDirs = await fsPromised.readdir(paths.directories.extensions)
    extensionsDirs.forEach(async (dirName) => {
      // Get paths for extensions directory and manifest.
      const extensionDir = path.join(paths.directories.extensions, dirName)
      const manifestPath = path.join(extensionDir, 'manifest.json')
      // Check if the manifest exists.
      await fsPromised.access(manifestPath)

      // Parse the manifest.
      const manifestContent = await fsPromised.readFile(manifestPath)
      const manifestObject = JSON.parse(manifestContent)

      manifestObject.id = id
      
      // Change relative paths to absolute paths.
      if (manifestObject.background != null) {
        if (manifestObject.background.page != null) {
          manifestObject.background.page = path.join(extensionDir, manifestObject.background.page).replace(/\\/g,"/")
        }
      }

      // Add extension to Store.
      Store.extensions.push(manifestObject)

      id++
    })
  } catch (e) {
    console.error(e)
  }
}