import { RegisterProps } from './views/phone'
import { PhoneWindow } from './phoneWindow'
import { FlowrWindow } from 'src/frontend/flowr-window'
import { BrowserWindow } from 'electron'

export type OpenPhoneProps = { registerProps: RegisterProps, show?: boolean, lang?: string }

export function createPhoneWindow(openPhoneProps: OpenPhoneProps, flowrWindow: FlowrWindow, wexondWindow: BrowserWindow): PhoneWindow {
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
    if (!windowToMute.webContents.isAudioMuted()) {
      windowToMute.webContents.setAudioMuted(true)
    }
  }

  function unmuteWindow(windowToMute: BrowserWindow) {
    if (windowToMute.webContents.isAudioMuted()) {
      windowToMute.webContents.setAudioMuted(false)
    }
  }

  const phoneWindow = new PhoneWindow(flowrWindow, flowrWindow.phoneServerUrl, openPhoneProps.registerProps, openPhoneProps.lang)
  phoneWindow.on('show', mute)
  phoneWindow.on('hide', unmute)
  phoneWindow.on('close', unmute)

  return phoneWindow
}
