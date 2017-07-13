import { remote } from 'electron'

export const getCurrentWindow = () => {
  return remote.getCurrentWindow()
}

export const close = () => {
  getCurrentWindow().close()
}

export const minimize = () => {
  getCurrentWindow().minimize()
}

export const maximize = () => {
  const currentWindow = getCurrentWindow()

  if (currentWindow.isMaximized()) {
    currentWindow.unmaximize()
  } else {
    currentWindow.maximize()
  }
}

