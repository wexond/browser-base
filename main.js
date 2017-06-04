const {app, BrowserWindow} = require('electron')
const protocol = require('electron').protocol
const path = require('path')

const protocolName = 'wexond'

let mainWindow

/** Global events. */

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow == null) {
    createWindow()
  }
})

process.on('uncaughtException', function (error) {
  console.log(error)
})

/**
 * Prepares browser window for browser and menu.
 */
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    frame: false,
    minWidth: 300,
    minHeight: 430,
    show: false
  })
  mainWindow.loadURL(path.join('file://', __dirname, '/src/public/app/index.html'))
  mainWindow.setMenu(null)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('unresponsive', function () {})

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (process.env.ENV === 'dev' || process.argv[3] === 'dev') {
    mainWindow.webContents.openDevTools({mode: 'detach'})
  }
}

protocol.registerStandardSchemes([protocolName])
app.on('ready', function () {
  /**
  * Creates protocol wexond://
  */
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    let url = request.url.substr(protocolName.length + 3)
    let lastChar = url.substr(url.length - 1)

    if (lastChar === '/') {
      url += 'index.html'
    }

    let data = path.join(__dirname, '/src/public/', url)

    callback(data)

    console.log(data)
  }, (error) => {
    if (error) {
      console.error('Failed to register protocol ' + protocolName + '://')
    }
  })
  createWindow()
})

global.start = {
  args: process.argv,
  file: false,
  env: process.env.ENV
}
