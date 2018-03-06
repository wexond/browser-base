import { remote } from 'electron'

export const getCurrentWindow = () => {
  return remote.getCurrentWindow()
}

export const close = (): void => {
  getCurrentWindow().close()
}

export const minimize = (): void => {
  getCurrentWindow().minimize()
}

export const maximize = (): void => {
  const currentWindow = getCurrentWindow()

  if (currentWindow.isMaximized()) {
    currentWindow.unmaximize()
  } else {
    currentWindow.maximize()
  }
}

