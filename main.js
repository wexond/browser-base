const { app, BrowserWindow, ipcMain } = require('electron')
const protocol = require('electron').protocol
const path = require('path')
const ipcMessages = require(path.join(__dirname, '/src/defaults/ipc-messages'))
const { autoUpdater } = require('electron-updater')
const fs = require('fs')
const { AdBlockClient, FilterOptions } = require('ad-block')

const windowDataPath = path.join(app.getPath('userData'), "window-data.json");

const protocolName = 'wexond'

let mainWindow

let windowBounds = {}

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

ipcMain.on('newWindow', () => {
  createWindow()
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
  let data = null
  try {
    data = fs.readFileSync(windowDataPath)
    data = JSON.parse(data)
  } catch (e) {
    console.error(e)
  }

  const windowData = {
    frame: false,
    minWidth: 300,
    minHeight: 430,
    width: 900,
    height: 700,
    show: false,
    titleBarStyle: 'hidden-inset'
  }

  if (data != null && data.bounds != null) {
    Object.assign(windowData, data.bounds)
  }

  mainWindow = new BrowserWindow(windowData)
  mainWindow.loadURL(path.join('file://', __dirname, '/public/app/index.html'))
  mainWindow.setMenu(null)

  windowBounds = mainWindow.getBounds()

  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      windowBounds = mainWindow.getBounds()
    }
  })

  mainWindow.on('move', () => {
    if (!mainWindow.isMaximized()) {
      windowBounds = mainWindow.getBounds()
    }
  })

  if (data != null && data.maximized) {
    mainWindow.maximize()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', () => {
    data = {
      maximized: mainWindow.isMaximized(),
      bounds: windowBounds
    }

    fs.writeFileSync(windowDataPath, JSON.stringify(data))
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
  
  const client = new AdBlockClient()

  fs.readFile(path.join(__dirname, 'adblock/adblock.dat'), (err, data) => {
    if (err) return console.error(err)

    client.deserialize(data)

    client.parse('@@||freegeoip.net/json^')

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

    /* TODO
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    })*/
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

app.setJumpList(
  [
    {
      name: 'Bookmarks',
      items: [
        {
          type: 'task',
          title: 'GitHub',
          program: process.execPath,
          args: '--run-tool-a',
          icon: `${__dirname}/resources/icon.ico`,
          description: 'GitHub is where people build software. More than 27 million people use GitHub to discover, fork, and contribute to over 76 million projects.'
        }
      ]
    }
  ]
)