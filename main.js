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

app.on('activate', () => {
  if (mainWindow == null) {
    createWindow()
  }
})

process.on('uncaughtException', (error) => {
  console.log(error)
})

function createWindow () {
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
