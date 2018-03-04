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