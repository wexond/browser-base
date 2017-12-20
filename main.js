const {app, BrowserWindow} = require('electron')
const protocol = require('electron').protocol
const path = require('path')
const ipcMessages = require(path.join(__dirname, '/src/defaults/ipc-messages.js'))

const protocolName = 'wexond'

let mainWindow

const handleSquirrelEvent = () => {
  if (process.argv.length === 1) return false

  const ChildProcess = require('child_process')
  const path = require('path')

  const appFolder = path.resolve(process.execPath, '..')
  const rootAtomFolder = path.resolve(appFolder, '..')
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))
  const exeName = path.basename(process.execPath)

  const spawn = (command, args) => {
    let spawnedProcess, error

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true})
    } catch (error) {}

    return spawnedProcess
  }

  const spawnUpdate = (args) => {
    return spawn(updateDotExe, args)
  }

  const squirrelEvent = process.argv[1]
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName])

      setTimeout(app.quit, 1000)
      return true

    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName])

      setTimeout(app.quit, 1000)
      return true

    case '--squirrel-obsolete':
      app.quit()
      return true
  }
}

if (handleSquirrelEvent()) return

/** Global events. */

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow == null) {
    createWindow()
  }
})

process.on('uncaughtException', (error) => {
  console.log(error)
})

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    frame: false,
    minWidth: 300,
    minHeight: 430,
    show: false
  })
  mainWindow.loadURL(path.join('file://', __dirname, '/public/app/index.html'))
  mainWindow.setMenu(null)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('unresponsive', () => {})

  mainWindow.on('app-command', function (e, cmd) {
    switch (cmd) {
      case 'browser-backward':
        mainWindow.webContents.send(ipcMessages.BROWSER_GO_BACK)
        return
      case 'browser-forward':
        mainWindow.webContents.send(ipcMessages.BROWSER_GO_FORWARD)
        return
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (process.env.NODE_ENV === 'dev') {
    mainWindow.webContents.openDevTools({mode: 'detach'})
  }
}

protocol.registerStandardSchemes([protocolName])
app.on('ready', function () {
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    let url = request.url.substr(protocolName.length + 3)
    let lastChar = url.substr(url.length - 1)

    if (lastChar === '/') {
      url += 'index.html'
    }

    let data = path.join(__dirname, '/public/', url)

    callback(data)
  }, (error) => {
    if (error) {
      console.error('Failed to register protocol ' + protocolName + '://')
    }
  })
  createWindow()
})
