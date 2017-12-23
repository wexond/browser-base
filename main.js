const { app, BrowserWindow } = require('electron')
const protocol = require('electron').protocol
const path = require('path')
const ipcMessages = require(path.join(__dirname, '/src/defaults/ipc-messages'))
const { autoUpdater } = require('electron-updater')
const fs = require('fs')
const adblockFilterParser = require(path.join(__dirname, '/src/utils/adblock-filter-parser'))

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
    show: false
  })
  mainWindow.loadURL(path.join('file://', __dirname, '/public/app/index.html'))
  mainWindow.setMenu(null)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const dataTest = String(fs.readFileSync(path.join(__dirname, 'easylistTest.txt'), 'utf8'))
  const categoriesTest = adblockFilterParser.parse(dataTest)

  const data = String(fs.readFileSync(path.join(__dirname, 'easylist.txt'), 'utf8'))
  const categories = adblockFilterParser.parse(data)

  console.log(adblockFilterParser.isAd('http://example.com/banner/foo/img', categoriesTest) + ' true')
  console.log(adblockFilterParser.isAd('http://example.com/banner/foo/bar/img?param', categoriesTest) + ' true')
  console.log(adblockFilterParser.isAd('http://example.com/banner//img/foo', categoriesTest) + ' true')
  console.log(adblockFilterParser.isAd('http://example.com/banner/img', categoriesTest) + ' false')
  console.log(adblockFilterParser.isAd('http://example.com/banner/foo/imgraph', categoriesTest) + ' false')
  console.log(adblockFilterParser.isAd('http://example.com/banner/foo/img.gif', categoriesTest) + ' false')

  console.log(adblockFilterParser.isAd('http://ads.example.com/foo.gif', categoriesTest) + ' true')
  console.log(adblockFilterParser.isAd('http://server1.ads.example.com/foo.gif', categoriesTest) + ' true')
  console.log(adblockFilterParser.isAd('https://ads.example.com:8000/', categoriesTest) + ' true')
  console.log(adblockFilterParser.isAd('http://ads.example.com.ua/foo.gif', categoriesTest) + ' false')
  console.log(adblockFilterParser.isAd('http://example.com/redirect/http://ads.example.com/', categoriesTest) + ' false')

  mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    if (adblockFilterParser.isAd(details.url, categories)) {
      return callback({
        cancel: true,
        requestHeaders: details.requestHeaders
      })
    }

    return callback({
      cancel: false,
      requestHeaders: details.requestHeaders
    })
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
