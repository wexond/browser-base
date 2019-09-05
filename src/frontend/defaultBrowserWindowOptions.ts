import { Store } from './src/store'
import { BrowserWindowConstructorOptions } from 'electron'

export default function (flowrStore: Store): BrowserWindowConstructorOptions {
  const kiosk = flowrStore.get('isKiosk') || false
  const winBounds = flowrStore.get('windowBounds')
  // Create the browser window.
  return {
    width: winBounds.width, // 1280,
    height: winBounds.height + 40, // 720, ??
    minWidth: 430,
    minHeight: 270,
    title: 'FlowR',
    fullscreen: kiosk,
    titleBarStyle: 'hiddenInset',
    alwaysOnTop: false,
  }
}
