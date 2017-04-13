const {app, BrowserWindow} = require('electron')
const protocol = require('electron').protocol
const path = require('path')

const protocolName = 'wexond'

let mainWindow

let browserMenu

// global events

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

/*
* prepares browser window
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
  mainWindow.loadURL(path.join('file://', __dirname, '/src/public/App/index.html'))
  mainWindow.setMenu(null)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('unresponsive', function () {})

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  browserMenu = new BrowserWindow({
    width: 300,
    height: 700,
    frame: false,
    resizable: false,
    transparent: true,
    parent: mainWindow,
    thickFrame: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    show: false
  })
  browserMenu.loadURL(path.join('file://', __dirname, '/src/public/Menu/index.html'))

  browserMenu.setIgnoreMouseEvents(true)

  browserMenu.on('blur', function () {
    browserMenu.send('menu:hide')
  })
  browserMenu.once('ready-to-show', () => {
    browserMenu.show()
  })

  if (process.env.ENV === 'dev') {
    mainWindow.webContents.openDevTools()
    browserMenu.webContents.openDevTools()
  }
}

/*
* creates protocol wexond://
*/
protocol.registerStandardSchemes([protocolName])
app.on('ready', function () {
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    var url = request.url.substr(protocolName.length + 3)
    var lastChar = url.substr(url.length - 1)
    var splitBySlash = url.split('/')
    if (lastChar !== '/') {
      url = url.replace(splitBySlash[0], '')
    }
    if (lastChar === '/') {
      url += 'index.html'
    }
    callback({
      path: path.normalize(path.join(__dirname, '/src/public/', url))
    })
  }, (error) => {
    if (error) {
      console.error('Failed to register protocol')
    }
  })
  createWindow()
})

global.start = {
  args: process.argv,
  file: false,
  env: process.env.ENV
}
