import fsPromised from '../actions/fs'
import path from 'path'

import paths from '../defaults/files'

import Store from '../stores/store'

let id = 0

export const loadExtensions = async () => {
  try {
    const extensionsDirs = await fsPromised.readdir(paths.directories.extensions)
    extensionsDirs.forEach(async (dirName) => {
      // Get paths for extensions directory and manifest.
      const extensionDir = path.join(paths.directories.extensions, dirName)
      const manifestPath = path.join(extensionDir, 'manifest.json')
      const iconDir = path.join(extensionDir, 'icon.png')
      const popupDir = path.join(extensionDir, 'index.html')

      // Check if the manifest exists.
      await fsPromised.access(manifestPath)

      // Parse the manifest.
      const manifestContent = await fsPromised.readFile(manifestPath)
      const manifestObject = JSON.parse(manifestContent)

      manifestObject.id = id

      // Change relative paths to absolute paths.
      if (manifestObject.background != null) {
        if (manifestObject.background.page != null) {
          manifestObject.background.page = path.join(extensionDir, manifestObject.background.page).replace(/\\/g, "/")
        }
      }

      // Add extension to Store.
      Store.extensions.push(manifestObject)

      id++
    })
  } catch (e) {
    console.error(e)
  }

  let concatCSP = (cspDirectives) => {
    let csp = ''
    for (let directive in cspDirectives) {
      csp += directive + ' ' + cspDirectives[directive] + '; '
    }
    return csp.trim()
  }

  let generateBrowserManifest = () => {
    const indexHTML = getBraveExtIndexHTML()

    let baseManifest = {
      name: 'wexond',
      manifest_version: 2,
      version: '0.3.0',
      background: {
        persistent: true
      }
    };
  }
}