import { ipcMain, app, BrowserWindow } from 'electron'
import { resolve } from 'path'
import { homedir } from 'os'
import { remove } from 'fs-extra'
import { autoUpdater } from 'electron-updater'
import { createFlowrWindow, initFlowrConfig, buildBrowserWindowConfig } from '../frontend'
import { createWexondWindow, setWexondLog } from '~/main'
import { getMigrateUserPreferences } from './migration/fromFlowrClientToFlowrPcClient'
import { PhoneWindow } from '../phone/phoneWindow'
import { RegisterProps } from '../phone/views/phone'
import { FlowrWindow } from 'src/frontend/flowr-window'
export const log = require('electron-log')
const migrateUserPreferences = getMigrateUserPreferences()
if (migrateUserPreferences) {
  initFlowrConfig(migrateUserPreferences)
}

type OpenPhoneProps = { registerProps: RegisterProps, show?: boolean, lang?: string }

app.commandLine.appendSwitch('widevine-cdm-path', resolve('/Applications/Google Chrome.app/Contents/Versions/74.0.3729.169/Google Chrome Framework.framework/Versions/A/Libraries/WidevineCdm/_platform_specific/mac_x64'))
// The version of plugin can be got from `chrome://components` page in Chrome.
app.commandLine.appendSwitch('widevine-cdm-version', '4.10.1303.2')

app.setPath('userData', resolve(homedir(), '.flowr-electron'))
log.transports.file.level = 'verbose'
log.transports.file.file = resolve(app.getPath('userData'), 'log.log')
setWexondLog(log)
ipcMain.setMaxListeners(0)
let flowrWindow: FlowrWindow | null = null
let wexondWindow: BrowserWindow | null = null
let phoneWindow: PhoneWindow | null = null
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (e, argv) => {
    if (flowrWindow) {
      if (flowrWindow.isMinimized()) flowrWindow.restore()
      flowrWindow.focus()
    }
  })
}

process.on('uncaughtException', error => {
  log.error(error)
})

app.on('ready', async () => {

  app.on('activate', async () => {
    if (flowrWindow === null) {
      await initFlowr()
    }
  })
  await initFlowr()

  autoUpdater.on('update-downloaded', ({ version }) => {
    // TODO
    if (flowrWindow) {
      flowrWindow.webContents.send('update-available', version)
    }
  })

  ipcMain.on('update-install', () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('update-check', () => {
    if (process.env.ENV !== 'dev') {
      autoUpdater.checkForUpdates()
    }
  })

  ipcMain.on('window-focus', () => {
    if (flowrWindow) {
      flowrWindow.webContents.focus()
    }
  })

  ipcMain.on('open-browser', (event: Event, options: any) => {
    if (wexondWindow === null) {
      wexondWindow = createWexondWindow(options, flowrWindow || undefined, buildBrowserWindowConfig({}))
      wexondWindow.on('close', () => {
        wexondWindow = null
      })
    } else {
      // wexondWindow.moveTop()
      wexondWindow.webContents.send('open-tab', options)
    }
  })
  ipcMain.on('close-browser', () => {
    if (wexondWindow !== null) {
      wexondWindow.close()
    }
  })
  ipcMain.on('open-flowr', () => {
    if (wexondWindow !== null) {
      wexondWindow.close()
    }
    // flowrWindow.moveTop()
  })

  ipcMain.on('openPhoneApp', (evt: any, openPhoneProps: OpenPhoneProps) => {
    if (!flowrWindow) {
      return
    }

    if (phoneWindow === null) {
      phoneWindow = new PhoneWindow(flowrWindow, flowrWindow.phoneServerUrl, openPhoneProps.registerProps, openPhoneProps.lang)
      phoneWindow.on('show', mute)
      phoneWindow.on('hide', unmute)
      phoneWindow.on('close', () => {
        unmute()
        phoneWindow = null
      })
    }
    if (openPhoneProps.registerProps) {
      phoneWindow.registerProps = openPhoneProps.registerProps
    }
    if (openPhoneProps.lang) {
      phoneWindow.changeLanguage(openPhoneProps.lang)
    }
    if (openPhoneProps.show) {
      phoneWindow.open()
    }
  })
})

ipcMain.on('clear-application-data', async () => {
  await remove(app.getPath('userData'))
  app.relaunch()
  app.exit()
})

app.on('window-all-closed', () => {
  app.quit()
})

async function initFlowr() {
  flowrWindow = await createFlowrWindow()
  flowrWindow.on('close', () => {
    if (phoneWindow) {
      phoneWindow.close()
    }
    flowrWindow = null
  })
  ipcMain.on('flowrLanguageChanged', changeLanguage)
}

function changeLanguage(e: Event, lang: string) {
  if (phoneWindow) {
    phoneWindow.changeLanguage(lang)
  }
}

function mute() {
  if (flowrWindow) {
    muteWindow(flowrWindow)
  }
  if (wexondWindow) {
    muteWindow(wexondWindow)
  }
}

function unmute() {
  if (flowrWindow) {
    unmuteWindow(flowrWindow)
  }
  if (wexondWindow) {
    unmuteWindow(wexondWindow)
  }
}

function muteWindow(windowToMute: BrowserWindow) {
  if (!windowToMute.webContents.isAudioMuted) {
    windowToMute.webContents.setAudioMuted(true)
  }
}

function unmuteWindow(windowToMute: BrowserWindow) {
  if (windowToMute.webContents.isAudioMuted) {
    windowToMute.webContents.setAudioMuted(false)
  }
}
