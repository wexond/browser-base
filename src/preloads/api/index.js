const { ipcRenderer } = require('electron');
const ipcMessages = require('../../renderer/defaults/ipc-messages');

class EventEmitter {
  constructor(scope, name) {
    this.name = name;
    this.scope = scope;

    ipcRenderer.on(`${ipcMessages.EXTENSION_EXECUTE_EVENT}-${scope}-${name}`, (e, ...args) => {
      this.emit(args);
    });
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(x => x !== callback);
  }

  emit(...args) {
    for (const listener of this.listeners) {
      try {
        listener(...args);
      } catch (e) {
        this.removeListener(listener);
      }
    }
  }
}

const injectAPI = () => {
  const api = {
    wexond: {
      webNavigation: {
        onCommitted: new EventEmitter('webNavigation', 'onCommitted'),
      },
      extension: {
        reload: () => {
          ipcRenderer.sendToHost(ipcMessages.EXTENSION_RELOAD);
        },
      },
    },
  };
  return api;
};

module.exports = injectAPI;
