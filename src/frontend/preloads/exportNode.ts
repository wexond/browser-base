declare global {
  namespace NodeJS {
    interface Global {
      nodeRequire: any
      nodeProcess: any
    }
  }
}

const nodeRequire: {[key: string]: any} = {
  electron: require('electron'),
  fs: require('fs'),
  os: require('os'),
  path: require('path'),
};
const nodeProcess = process;

process.once('loaded', () => {
  global.nodeRequire = (moduleName: string): any => {
    const requiredModule = nodeRequire[moduleName]

    if (!requiredModule) {
      throw Error(`Cannot find module ${moduleName}. It must be explicitely exported from the client.`)
    }

    return requiredModule
  }
  global.nodeProcess = nodeProcess;
});

const ipc = nodeRequire['electron'].ipcRenderer
const hiddenMenuCode = 'configtaktik'

let codeClearingTimeout: number
let hiddenMenuCodeIndex = 0

function handleHiddenMenuCode(event: KeyboardEvent): any {
  const char = event.key
  if (codeClearingTimeout) {
    clearTimeout(codeClearingTimeout)
  }

  codeClearingTimeout = setTimeout(() => {
    hiddenMenuCodeIndex = 0
  }, 3500)

  if (hiddenMenuCode[hiddenMenuCodeIndex++] !== char) {
    return hiddenMenuCodeIndex = 0
  }

  if (hiddenMenuCodeIndex === hiddenMenuCode.length) {
    ipc.send('openConfigMode')
  }
}

document.addEventListener('keydown', handleHiddenMenuCode)

export {};
