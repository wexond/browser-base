const { app, BrowserWindow } = require('electron')
const protocol = require('electron').protocol
const path = require('path')
const ipcMessages = require(path.join(__dirname, '/src/defaults/ipc-messages'))
const { autoUpdater } = require('electron-updater')
const fs = require('fs')
const {AdBlockClient, FilterOptions} = require('ad-block')

const protocolName = 'wexond'

let mainWindow

/** Global events. */

app.on('ready', () =>  {
  if (process.env.NODE_ENV !== 'dev') autoUpdater.checkForUpdates()
})

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

autoUpdater.on('checking-for-update', () => {})
autoUpdater.on('update-available', (info) => {})
autoUpdater.on('update-not-available', (info) => {})
autoUpdater.on('error', (err) => {})
autoUpdater.on('download-progress', (progressObj) => {})

autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall()
})

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    frame: false,
    minWidth: 300,
    minHeight: 430,
    show: false,
    titleBarStyle: 'hidden-inset'
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

    const client = new AdBlockClient()

    fs.readFile(path.join(__dirname, 'detector.buffer'), (err, data) => {
      if (err) return console.error(err)

      client.deserialize(data)

      mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {

        if (details.url.startsWith('http://') || details.url.startsWith('https://')) {
          const isAd = client.matches(details.url, FilterOptions.noFilterOption)

          if (isAd) {
            return callback({
              cancel: true,
              requestHeaders: details.requestHeaders
            })
          }
        }
       
        return callback({
          cancel: false,
          requestHeaders: details.requestHeaders
        })
      })
    })
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
