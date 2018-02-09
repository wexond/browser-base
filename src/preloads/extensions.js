const { ipcRenderer } = require('electron')
const ipcMessages = require('../defaults/ipc-messages')
const extensionsDefaults = require('../defaults/extensions')

class EventEmitter {
  constructor (name) {
    this.name = name
    this.callbacks = []

    ipcRenderer.on(ipcMessages.EXTENSION_EXECUTE_EVENT + this.name, (e, args) => {
      this.execute(args)
    })
  }

  addListener (callback) {
    this.callbacks.push(callback)
  }

  removeListener (callback) {
    this.callbacks.splice(this.callbacks.indexOf(callback), 1)
  }

  execute (e) {
    for (var i = this.callbacks.length; i--;) {
      if (typeof this.callbacks[i] === 'function') {
        this.callbacks[i](e)
      }
    }
  }
}

// Wexond API.
global.wexond = {
  webNavigation: {
    onCommited: new EventEmitter(extensionsDefaults.events.webNavigation.onCommited)
  },
  extension: {
    reload: () => {
      ipcRenderer.sendToHost(ipcMessages.EXTENSION_RELOAD)
    }
  }
}

export const loadExtensions = async () => {
  try {
    const extensionsDirs = await fsPromised.readdir(paths.directories.extensions)
    extensionsDirs.forEach(async (dirName) => {
      // Get paths for extensions directory and manifest.
      const extensionDir = path.join(paths.directories.extensions, dirName)
      const manifestPath = path.join(extensionDir, 'manifest.json')

      const popupPath = path.join(extensionDir,'index.html')
      // Check if the manifest exists.
      await fsPromised.access(manifestPath)

      // Parse the manifest.
      const manifestContent = await fsPromised.readFile(manifestPath)
      const manifestObject = JSON.parse(manifestContent)
      const index = await fsPromised.readFile(popupPath)

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

 var browserActions = {
    setTitle = manifestContent.name,
    setPopup = popupPath.path,
    setBackgroundColor = index.body.style.backgroundColor,
 };
