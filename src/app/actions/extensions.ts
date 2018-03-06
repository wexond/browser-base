import path from 'path'
import fsPromised from '../actions/fs'

import paths from '../defaults/files'

import Store from '../store'

let id: number = 0

export const loadExtensions = async (): Promise<void> => {
  try {
    const extensionsDirs: string[] = await fsPromised.readdir(paths.directories.extensions)
    extensionsDirs.forEach(async (dirName: string) => {
      // Get paths for extensions directory and manifest.
      const extensionDir: string = path.join(paths.directories.extensions, dirName)
      const manifestPath: string = path.join(extensionDir, 'manifest.json')
      // Check if the manifest exists.
      await fsPromised.access(manifestPath)

      // Parse the manifest.
      const manifestContent: string = await fsPromised.readFile(manifestPath)
      const manifestObject: any = JSON.parse(manifestContent)

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