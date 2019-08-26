import { resolve, join } from 'path';
import { homedir } from 'os';
import { ipcMain, Menu, app, protocol, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { Store, initConfigData } from './src/store'
import { FlowrWindow } from './flowr-window'
import { extend } from 'lodash'
import { URL } from 'url'
const network = require('network');
const deepExtend = require('deep-extend')
import defaultBrowserWindowOptions from './defaultBrowserWindowOptions'
const FlowrDataDir = resolve(homedir(), '.flowr')
const CONFIG_NAME = 'user-preferences.json'

export function initFlowrConfig(data: object) {
  initConfigData(join(FlowrDataDir, CONFIG_NAME), data)
}

const RELOAD_INTERVAL = 120000 // 2min

let isDebugMode: boolean
let isHiddenMenuDisplayed = false
let isLaunchedUrlCorrect = true
let reloadTimeout: number | undefined

const flowrStore = new Store(FlowrDataDir, {
  // We'll call our data file 'user-preferences'
  configName: CONFIG_NAME,
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 1280, height: 720 },
    channelData: {},
    isMaximized: false,
  },
})
export function buildBrowserWindowConfig(options: BrowserWindowConstructorOptions): BrowserWindowConstructorOptions {
  return extend(options, defaultBrowserWindowOptions(flowrStore))
}

export async function createFlowrWindow(): Promise<BrowserWindow> {
  const mac = await getMacAddress()
  const winBounds = flowrStore.get('windowBounds')

  const defaultUrl = buildFileUrl('config.html')
  const kiosk = flowrStore.get('isKiosk') || false
  const url = new URL(flowrStore.get('extUrl') || defaultUrl)
  // Create the browser window.
  const opts = buildBrowserWindowConfig({
    icon: resolve(app.getAppPath(), 'static/app-icons/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      partition: 'persist:view', // needed to display webcame image
      preload: buildExportPath('exportNode.js'),
    },
  })

  const mainWindow = new FlowrWindow(flowrStore, opts)

  if (flowrStore.get('isMaximized')) {
    mainWindow.maximize()
  }
  // mainWindow.setAspectRatio(16/9)
  mainWindow.setMenuBarVisibility(false)
  // mainWindow.setAlwaysOnTop(true, 'floating', 0)

  url.searchParams.set('mac', mac)
  mainWindow.loadURL(url.href)
  reloadTimeout = setInterval(reload, RELOAD_INTERVAL)

  // Open the DevTools.
  if (process.env.ENV === 'dev') {
    mainWindow.webContents.openDevTools()
    isDebugMode = true
  }

  function displayHiddenMenu(): void {
    const flowrUrl = flowrStore.get('extUrl') || buildFileUrl('config.html')
    const template: any = [
      { label: 'Menu',
        submenu: [
          { label: 'Config',
            click() {
              const formattedPath = buildFileUrl('config.html')
              console.log('formattedPath', formattedPath)
              mainWindow.loadURL(formattedPath)
              isHiddenMenuDisplayed = true
            },
          },
          {
            label: 'Flowr',
            click() {
              isHiddenMenuDisplayed = false
              mainWindow.loadURL(flowrUrl)
            },
          },
          {
            label: 'Hide Menu',
            click() {
              mainWindow.setMenuBarVisibility(false)
              if (isHiddenMenuDisplayed) {
                mainWindow.loadURL(flowrUrl)
              }
            },
          },
        ]},
    ]

    const appMenu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(appMenu)
    mainWindow.setMenuBarVisibility(true)
  }

  ipcMain.on('FlowrIsInitializing', () => {
    clearInterval(reloadTimeout)
    isLaunchedUrlCorrect = true
  })

  ipcMain.on('getAppConfig', (evt: any) => {
    const storedConfig =  flowrStore.get('flowrConfig')
    const  config: any =  {
      debugMode : isDebugMode,
      isLaunchedUrlCorrect,
      deinterlacing: flowrStore.get('deinterlacing'),
    }
    // no need to expose the complete config
    if (storedConfig && storedConfig.ozoneApi) {
      const ozoneApi = storedConfig.ozoneApi.hostProxy || ''
      const flowrApi = (storedConfig.flowrApi && storedConfig.flowrApi.hostProxy) || ''
      const socketApi = (storedConfig.socketApi && storedConfig.socketApi.host) || ''
      const pushVodSocketApi = (storedConfig.pushVodSocketApi && storedConfig.pushVodSocketApi.host) || ''
      const aneviaVodSocketApi = (storedConfig.aneviaVodSocketApi && storedConfig.aneviaVodSocketApi.host) || ''

      config.appConfig = {
        ozoneApi: {
          hostProxy: ozoneApi,
        },
        flowrApi: {
          hostProxy: flowrApi,
        },
        socketApi: {
          host: socketApi,
        },
        pushVodSocketApi:{
          host: pushVodSocketApi,
        },
        aneviaVodSocketApi:{
          host: aneviaVodSocketApi,
        },
      }
    }

    config.extUrl = flowrStore.get('extUrl')
    config.isKiosk = flowrStore.get('isKiosk')

    evt.sender.send('receiveConfig', config)
  })

  ipcMain.on('getMacAddress', async(evt: any) => {
    const usedMacAddress = await getMacAddress()
    evt.sender.send('receiveMacAddress', usedMacAddress)
  })

  ipcMain.on('updateAppConfig', (evt: any, data: any) => {
    const currentConfig = flowrStore.get('flowrConfig')
    const newConfig =  deepExtend(currentConfig, data)
    console.log(JSON.stringify(data))
    flowrStore.set('flowrConfig', newConfig)
    app.relaunch()
    app.quit()
  })

  ipcMain.on('setDebugMode', (evt: any, debugMode: boolean) => {
    const currentConfig = flowrStore.get('flowrConfig')
    isDebugMode = debugMode
    if (isDebugMode) {
      mainWindow.webContents.openDevTools()
    } else {
      mainWindow.webContents.closeDevTools()
    }
  })

  ipcMain.on('setDeinterlacingMode', (evt: any, deinterlacingMode: any) => {
    flowrStore.set('deinterlacing', deinterlacingMode)
  })

  ipcMain.on('setKioskMode', (evt: any, isKiosk: boolean) => {
    flowrStore.set('isKiosk', isKiosk)
    app.relaunch()
    app.quit()
  })

  ipcMain.on('setExtUrl', (evt: any, newExtURl: string) => {
    console.log('set new ext url', newExtURl)
    flowrStore.set('extUrl', newExtURl)
    app.relaunch()
    app.quit()
  })

  ipcMain.on('openConfigMode', displayHiddenMenu)

  function buildFileUrl(fileName: string): string {
    let result: string
    if (process.env.ENV === 'dev') {
      result = `http://localhost:4444/${fileName}`;
    } else {
      result = join('file://', app.getAppPath(), 'build', fileName)
    }
    return result
  }

  function buildExportPath(fileName: string): string {
    let result: string = resolve(app.getAppPath(), `build/${fileName}`)
    if (process.env.ENV !== 'dev') {
      result = join(app.getAppPath(), `/build/${fileName}`)
    }
    return result
  }

  function getMacAddress(): Promise<string> {
    return new Promise(((resolve, reject) => {
      network.get_active_interface((err: Error, obj: any) => {
        if (err) {
          throw (err)
        }
        if (obj && obj.mac_address) {
          resolve(obj.mac_address)
        } else {
          reject(Error('no Mac Address Found'))
        }
      })
    }))
  }

  function reload() {
    if (mainWindow) {
      mainWindow.reload()
    }
  }

  return mainWindow
}
