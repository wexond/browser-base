const { ipcRenderer } = require('electron');

/* eslint no-bitwise: 0 */
const hashCode = () => {
  let hash = 0;

  if (this.length === 0) {
    return hash;
  }

  for (let i = 0; i < this.length; i++) {
    const chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

class WebRequestEvent {
  constructor(scope, name) {
    this.scope = scope;
    this.name = name;
    this.callbacks = [];
    this.listener = false;

    this.emit = this.emit.bind(this);
  }

  emit(e, details) {
    this.callbacks.forEach(callback => {
      ipcRenderer.send(`extension-response-${this.scope}-${this.name}`, callback(details));
    });
  }

  addListener(callback) {
    this.callbacks.push(callback);

    if (!this.listener) {
      ipcRenderer.on(`extension-emit-event-${this.scope}-${this.name}`, this.emit);
      ipcRenderer.send(`extension-add-listener-${this.scope}-${this.name}`);
      this.listener = true;
    }
  }

  removeListener(callback) {
    this.callbacks = this.callbacks.filter(c => c !== callback);

    if (this.callbacks.length === 0) {
      ipcRenderer.removeListener(`extension-emit-event-${this.scope}-${this.name}`, this.emit);
      ipcRenderer.send(`extension-remove-listener-${this.scope}-${this.name}`);
      this.listener = false;
    }
  }
}

class IpcEvent {
  constructor(scope, name) {
    this.name = name;
    this.scope = scope;
    this.callbacks = [];
    this.listener = false;

    this.emit = this.emit.bind(this);
  }

  emit(e, ...args) {
    this.callbacks.forEach(callback => {
      callback(...args);
    });
  }

  addListener(callback) {
    this.callbacks.push(callback);

    if (!this.listener) {
      ipcRenderer.on(`extension-emit-event-${this.scope}-${this.name}`, this.emit);
      this.listener = true;
    }
  }

  removeListener(callback) {
    this.callbacks = this.callbacks.filter(x => x !== callback);

    if (this.callbacks.length === 0) {
      ipcRenderer.removeListener(`extension-emit-event-${this.scope}-${this.name}`, this.emit);
      this.listener = false;
    }
  }
}

const getAPI = () => {
  // https://developer.chrome.com/extensions
  const api = {
    // https://developer.chrome.com/extensions/webNavigation
    webNavigation: {
      onBeforeNavigate: new IpcEvent('webNavigation', 'onBeforeNavigate'),
      onCommitted: new IpcEvent('webNavigation', 'onCommitted'),
      onDOMContentLoaded: new IpcEvent('webNavigation', 'onDOMContentLoaded'),
      onCompleted: new IpcEvent('webNavigation', 'onCompleted'),
      onCreatedNavigationTarget: new IpcEvent('webNavigation', 'onCreatedNavigationTarget'),
      onReferenceFragmentUpdated: new IpcEvent('webNavigation', 'onReferenceFragmentUpdated'), // TODO
      onTabReplaced: new IpcEvent('webNavigation', 'onTabReplaced'), // TODO
      onHistoryStateUpdated: new IpcEvent('webNavigation', 'onHistoryStateUpdated'), // TODO

      getFrame: (details, callback) => {}, // TODO
      getAllFrames: (details, callback) => {}, // TODO
    },

    // https://developer.chrome.com/extensions/extension
    extension: {
      inIncognitoContext: false, // TODO

      getBackgroundPage: () => null, // TODO
      isAllowedIncognitoAccess: callback => {}, // TODO
      isAllowedFileSchemeAccess: callback => {}, // TODO
      setUpdateUrlData: data => {}, // TODO
    },

    // https://developer.chrome.com/extensions/alarms
    alarms: {
      create: (name, alarmInfo) => {}, // TODO
      get: (name, callback) => {}, // TODO
      getAll: callback => {},
      clear: (name, callback) => {}, // TODO
      clearAll: callback => {}, // TODO

      onAlarm: new IpcEvent('alarms', 'onAlarm'), // TODO
    },

    // https://developer.chrome.com/extensions/webRequest
    webRequest: {
      onBeforeRequest: new WebRequestEvent('webRequest', 'onBeforeRequest'),
      onBeforeSendHeaders: new WebRequestEvent('webRequest', 'onBeforeSendHeaders'),
      onHeadersReceived: new WebRequestEvent('webRequest', 'onHeadersReceived'),
      onSendHeaders: new WebRequestEvent('webRequest', 'onSendHeaders'),
      onResponseStarted: new WebRequestEvent('webRequest', 'onResponseStarted'),
      onBeforeRedirect: new WebRequestEvent('webRequest', 'onBeforeRedirect'),
      onCompleted: new WebRequestEvent('webRequest', 'onCompleted'),
      onErrorOccurred: new WebRequestEvent('webRequest', 'onErrorOccurred'),
    },

    // https://developer.chrome.com/extensions/tabs
    tabs: {
      get: (tabId, callback) => {
        api.tabs.query({ id: tabId }, tabs => {
          callback(tabs[0]);
        });
      },
      getCurrent: callback => {
        ipcRenderer.sendToHost('extension-get-current-tab');

        ipcRenderer.once('extension-get-current-tab', (e, data) => {
          callback(data);
        });
      },
      query: (queryInfo, callback) => {
        ipcRenderer.send('extension-get-all-tabs');

        ipcRenderer.once('extension-get-all-tabs', (e, data) => {
          callback(
            data.filter(tab => {
              for (const key in queryInfo) {
                if (tab[key] == null || queryInfo[key] !== tab[key]) return false;
              }

              return true;
            }),
          );
        });
      },
      create: (createProperties, callback = null) => {
        ipcRenderer.send('extension-create-tab', createProperties);

        if (callback) {
          ipcRenderer.once('extension-create-tab', (e, data) => {
            callback(data);
          });
        }
      },

      onCreated: new IpcEvent('tabs', 'onCreated'),
      onUpdated: new IpcEvent('tabs', 'onUpdated'),
      onMoved: new IpcEvent('tabs', 'onMoved'), // TODO
      onActivated: new IpcEvent('tabs', 'onActivated'), // TODO
      onHighlighted: new IpcEvent('tabs', 'onHighlighted'), // TODO
      onDetached: new IpcEvent('tabs', 'onDetached'), // TODO
      onAttached: new IpcEvent('tabs', 'onAttached'), // TODO
      onRemoved: new IpcEvent('tabs', 'onRemoved'), // TODO
      onReplaced: new IpcEvent('tabs', 'onReplaced'), // TODO
      onZoomChange: new IpcEvent('tabs', 'onZoomChange'), // TODO
    },
  };
  return api;
};

module.exports = getAPI;
