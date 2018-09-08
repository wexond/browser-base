import { remote } from 'electron';

export const getCurrentWindow = () => remote.getCurrentWindow();

export const closeWindow = () => {
  getCurrentWindow().close();
};

export const minimizeWindow = () => {
  getCurrentWindow().minimize();
};

export const maximizeWindow = () => {
  const currentWindow = getCurrentWindow();

  if (currentWindow.isMaximized()) {
    currentWindow.unmaximize();
  } else {
    currentWindow.maximize();
  }
};
