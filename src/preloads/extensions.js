const { ipcRenderer } = require('electron')
const ipcMessages = require('../defaults/ipc-messages')
const extensionsDefaults = require('../defaults/extensions')

import { observable, autorun, action } from "mobx";

const fs = require('fs')
const path = require('path')
const { remote } = require('electron')

class EventEmitter {
  constructor(name) {
    this.name = name
    this.callbacks = []

    ipcRenderer.on(ipcMessages.EXTENSION_EXECUTE_EVENT + this.name, (e, args) => {
      this.execute(args)
    })
  }

  addListener(callback) {
    this.callbacks.push(callback)
  }

  removeListener(callback) {
    this.callbacks.splice(this.callbacks.indexOf(callback), 1)
  }

  execute(e) {
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

//To Create Extentions Folder
function createExtentionsFolder() {
  var myObject, newfolder;
  myObject = new ActiveXObject("Scripting.FileSystemObject");
  newfolder = myObject.CreateFolder("../extentions");
}
createExtentionsFolder();

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
});

var extName = manifestObject.name;
var extIdNumber = manifestObject.id;
