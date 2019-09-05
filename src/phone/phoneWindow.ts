import { BrowserWindow, Rectangle, app, ipcMain } from 'electron'
import { resolve, join } from 'path'
import { WindowModes } from './WindowModes'
import { RegisterProps } from './views/phone'

function buildFileUrl(fileName: string): string {
  let result: string
  if (process.env.ENV === 'dev') {
    result = `http://localhost:4444/${fileName}`
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

function buildPositionFromParents(parentRectangle: Rectangle) {
  return {
    width: Math.round(.5 * parentRectangle.width),
    height: Math.round(.5 * parentRectangle.height),
    x: Math.round(parentRectangle.x + .3 * parentRectangle.width),
    y: Math.round(parentRectangle.y),
  }
}
export class PhoneWindow extends BrowserWindow {
  _mode: WindowModes | undefined
  _registerProps: RegisterProps | undefined

  get _widgetPosition(): Rectangle {
    const contentBounds = this.getParentWindow().getBounds()
    return buildPositionFromParents(contentBounds)
  }

  get mode(): WindowModes | undefined {
    return this._mode
  }

  set mode(value: WindowModes | undefined) {
    this._mode = value
    if (value === WindowModes.WIDGET) {
      this.setBounds(this._widgetPosition, true)
    } else {
      this.setBounds(this.getParentWindow().getBounds(), true)
    }
    this.webContents.send('window-mode-changed', value)
  }

  set registerProps(value: RegisterProps) {
    this.webContents.send('register-props', value)
    this._registerProps = value
  }

  constructor(parent: BrowserWindow, phoneServer?: string, registerProps?: RegisterProps, lang?: string) {
    super(Object.assign({
      frame: false,
      transparent: true,
      show: false,
      parent,
      backgroundColor: '#8C777777',
      webPreferences: {
        plugins: true,
        nodeIntegration: false,
        contextIsolation: false,
        experimentalFeatures: true,
        preload: buildExportPath('phonePreload'),
      },
    }, buildPositionFromParents(parent.getContentBounds())))
    const pageUrl = new URL(buildFileUrl('phone.html'))

    if (phoneServer) {
      pageUrl.searchParams.append('server', phoneServer)
    }

    if (registerProps) {
      pageUrl.searchParams.append('username', registerProps.username)
      pageUrl.searchParams.append('host', registerProps.host)
    }

    if (lang) {
      pageUrl.searchParams.append('lang', lang)
    }

    this.loadURL(pageUrl.href)
    this.mode = WindowModes.WIDGET

    ipcMain.on('phone-maximize', () => this.mode = WindowModes.FULLSCREEN)
    ipcMain.on('phone-reduce', () => this.mode = WindowModes.WIDGET)
    ipcMain.on('phone-show', this.show.bind(this))
    ipcMain.on('phone-hide', this.hide.bind(this))
    ipcMain.on('register-props', this.updateRegisterProps.bind(this))
  }

  updateRegisterProps(e: Event, registerProps: RegisterProps) {
    console.log('Received register props', registerProps)
    this.registerProps = registerProps
  }

  open(mode: WindowModes = WindowModes.WIDGET) {
    this.mode = mode
    this.show()
  }

  changeLanguage(lang: string): void {
    this.webContents.send('change-language', lang)
  }
}
