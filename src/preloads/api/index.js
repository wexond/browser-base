const { ipcRenderer } = require('electron');

/* eslint no-bitwise:0 */
const hashCode = string => {
  let hash = 0;

  if (string.length === 0) {
    return hash;
  }

  for (let i = 0; i < string.length; i++) {
    const chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

class EventEmitter {
  constructor(scope, name) {
    this.name = name;
    this.scope = scope;
    this.listeners = [];
  }

  addListener(callback) {
    const id = hashCode(callback.toString());

    ipcRenderer.on(`extension-emit-event-${this.scope}-${this.name}-${id}`, (e, args) => {
      callback(...args);
    });

    ipcRenderer.send('extension-add-listener', this.scope, this.name, id);

    this.listeners.push(id);
  }

  removeListener(callback) {
    const id = hashCode(callback.toString());

    this.listeners = this.listeners.filter(x => x !== id);

    ipcRenderer.removeAllListeners(`extension-emit-event-${this.scope}-${this.name}-${id}`);

    ipcRenderer.send('extension-remove-listener', this.scope, this.name, id);
  }

  emit(...args) {
    ipcRenderer.send(`extension-emit-event-${this.scope}-${this.name}`, args);
  }
}

const injectAPI = () => {
  const api = {
    webNavigation: {
      onCommitted: new EventEmitter('webNavigation', 'onCommitted'),
    },
    extension: {
      reload: () => {
        ipcRenderer.sendToHost(ipcMessages.EXTENSION_RELOAD);
      },
    },
  };
  return api;
};

module.exports = injectAPI;
